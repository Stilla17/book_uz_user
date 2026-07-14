/* eslint-disable no-console */

const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const backendRoot = path.resolve(projectRoot, '..', 'backend');
const backendEnvPath = path.join(backendRoot, '.env');
const outputDirectory = path.join(projectRoot, 'migration-output');

const requireFromBackend = (moduleName) => require(path.join(backendRoot, 'node_modules', moduleName));

requireFromBackend('dotenv').config({ path: backendEnvPath });

const mongoose = requireFromBackend('mongoose');
const cloudinary = require(path.join(backendRoot, 'src', 'config', 'cloudinary'));
const Product = require(path.join(backendRoot, 'src', 'models', 'Product'));

const args = new Set(process.argv.slice(2));
const applyChanges = args.has('--apply');
const auditAllImages = args.has('--audit-all');
const migrateSecondaryImages = args.has('--secondary-images');
const limitArgument = [...args].find((argument) => argument.startsWith('--limit='));
const parsedLimit = limitArgument ? Number(limitArgument.split('=')[1]) : 0;
const limit = Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : 0;
const concurrencyArgument = [...args].find((argument) => argument.startsWith('--concurrency='));
const parsedConcurrency = concurrencyArgument ? Number(concurrencyArgument.split('=')[1]) : 5;
const concurrency = Number.isInteger(parsedConcurrency) && parsedConcurrency > 0 ? Math.min(parsedConcurrency, 10) : 5;

const oldImageBaseUrl = (process.env.OLD_IMAGE_BASE_URL || 'https://backend.book.uz/user-api/').replace(/\/+$/, '');
const cloudinaryFolder = process.env.CLOUDINARY_PRODUCT_MIGRATION_FOLDER || 'bookstore/products';

const isCloudinaryUrl = (value) => /^https?:\/\/res\.cloudinary\.com\//i.test(value);
const isRemoteUrl = (value) => /^https?:\/\//i.test(value);

const isOldServerUrl = (value) => {
    try {
        const oldBase = new URL(oldImageBaseUrl);
        const imageUrl = new URL(value);
        return imageUrl.origin === oldBase.origin && imageUrl.pathname.startsWith(oldBase.pathname.replace(/\/+$/, ''));
    } catch {
        return false;
    }
};

const shouldMigrate = (value) => {
    if (typeof value !== 'string' || !value.trim() || isCloudinaryUrl(value)) return false;
    return !isRemoteUrl(value) || isOldServerUrl(value);
};

const toSourceUrl = (value) => {
    const normalized = value.trim();
    if (isRemoteUrl(normalized)) return normalized;

    if (normalized.startsWith('/user-api/')) {
        const baseOrigin = new URL(oldImageBaseUrl).origin;
        return `${baseOrigin}${normalized}`;
    }

    return `${oldImageBaseUrl}/${normalized.replace(/^\/+/, '')}`;
};

const toPublicId = (sourceUrl) => {
    const pathname = new URL(sourceUrl).pathname;
    const filename = decodeURIComponent(path.posix.basename(pathname));
    const extension = path.posix.extname(filename);
    return filename.slice(0, extension ? -extension.length : undefined).replace(/[^a-zA-Z0-9_-]/g, '-');
};

const writeJson = (filename, data) => {
    fs.mkdirSync(outputDirectory, { recursive: true });
    fs.writeFileSync(path.join(outputDirectory, filename), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
};

const assertApplyConfiguration = () => {
    const requiredVariables = ['MONGODB_URI', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
    const missingVariables = requiredVariables.filter((name) => !process.env[name]);
    if (missingVariables.length) {
        throw new Error(`Backend .env faylida yetishmayotgan qiymatlar: ${missingVariables.join(', ')}`);
    }
};

const auditOldImageReferences = async () => {
    const checks = [
        { collection: 'products', field: 'images' },
        { collection: 'authors', field: 'image' },
        { collection: 'publishers', field: 'image' },
        { collection: 'news', field: 'image' },
        { collection: 'banners', field: 'imageUrl' },
        { collection: 'users', field: 'avatar' },
        { collection: 'reviews', field: 'images' }
    ];
    const oldReferencePattern = /^(?:\/?user-api\/|\/?img\/|https?:\/\/backend\.book\.uz\/user-api\/)/i;
    const results = [];

    for (const check of checks) {
        const collection = mongoose.connection.collection(check.collection);
        const query = { [check.field]: { $regex: oldReferencePattern } };
        const count = await collection.countDocuments(query);
        const samples = await collection
            .find(query, { projection: { _id: 1, [check.field]: 1 } })
            .limit(3)
            .toArray();
        results.push({ ...check, count, samples });
    }

    console.log(JSON.stringify(results, null, 2));
    return results;
};

const migrateSecondaryImageReferences = async () => {
    const configurations = [
        { collection: 'authors', field: 'image', folder: 'bookstore/authors' },
        { collection: 'publishers', field: 'image', folder: 'bookstore/publishers' }
    ];
    const oldReferencePattern = /^(?:\/?user-api\/|\/?img\/|https?:\/\/backend\.book\.uz\/user-api\/)/i;
    const candidates = [];

    for (const configuration of configurations) {
        const collection = mongoose.connection.collection(configuration.collection);
        const documents = await collection
            .find(
                { [configuration.field]: { $regex: oldReferencePattern } },
                { projection: { _id: 1, [configuration.field]: 1 } }
            )
            .toArray();

        documents.forEach((document) => {
            candidates.push({
                ...configuration,
                id: document._id,
                before: document[configuration.field]
            });
        });
    }

    console.log(`Rejim: ${applyChanges ? 'APPLY' : 'DRY RUN'}`);
    configurations.forEach((configuration) => {
        const count = candidates.filter((item) => item.collection === configuration.collection).length;
        console.log(`${configuration.collection}.${configuration.field}: ${count}`);
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    writeJson(`secondary-images-inventory-${timestamp}.json`, candidates.map((item) => ({ ...item, id: String(item.id) })));

    if (!applyChanges) {
        console.log('Secondary rasmlar upload qilinmadi. Davom etish uchun --secondary-images --apply ishlating.');
        return;
    }

    assertApplyConfiguration();
    const report = [];
    const checkpointPath = path.join(outputDirectory, `secondary-images-checkpoint-${timestamp}.jsonl`);
    let nextIndex = 0;
    let completedCount = 0;

    const worker = async () => {
        while (nextIndex < candidates.length) {
            const index = nextIndex;
            nextIndex += 1;
            const candidate = candidates[index];
            const sourceUrl = toSourceUrl(candidate.before);
            let reportItem;

            try {
                const uploaded = await cloudinary.uploader.upload(sourceUrl, {
                    folder: candidate.folder,
                    public_id: toPublicId(sourceUrl),
                    overwrite: false,
                    resource_type: 'image'
                });
                const updateResult = await mongoose.connection.collection(candidate.collection).updateOne(
                    { _id: candidate.id, [candidate.field]: candidate.before },
                    { $set: { [candidate.field]: uploaded.secure_url } }
                );
                if (updateResult.matchedCount !== 1) {
                    throw new Error('Hujjat migratsiya vaqtida o‘zgargan; DB update bekor qilindi');
                }

                reportItem = {
                    collection: candidate.collection,
                    id: String(candidate.id),
                    status: 'updated',
                    before: candidate.before,
                    after: uploaded.secure_url,
                    publicId: uploaded.public_id
                };
            } catch (error) {
                reportItem = {
                    collection: candidate.collection,
                    id: String(candidate.id),
                    status: 'failed',
                    before: candidate.before,
                    error: error instanceof Error ? error.message : String(error)
                };
                console.error(`XATO: ${candidate.collection}/${candidate.id} — ${reportItem.error}`);
            }

            report[index] = reportItem;
            fs.appendFileSync(checkpointPath, `${JSON.stringify(reportItem)}\n`, 'utf8');
            completedCount += 1;
            if (completedCount % 25 === 0 || completedCount === candidates.length) {
                console.log(`[${completedCount}/${candidates.length}] secondary rasm qayta ishlandi`);
            }
        }
    };

    await Promise.all(Array.from({ length: Math.min(concurrency, candidates.length) }, () => worker()));
    writeJson(`secondary-images-report-${timestamp}.json`, report);

    const updated = report.filter((item) => item.status === 'updated').length;
    const failed = report.filter((item) => item.status === 'failed').length;
    console.log(`Secondary rasmlar yakunlandi. Yangilandi: ${updated}; xato: ${failed}.`);
    if (failed) process.exitCode = 1;
};

const main = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error(`MONGODB_URI topilmadi: ${backendEnvPath}`);
    }

    if (applyChanges) assertApplyConfiguration();

    await mongoose.connect(process.env.MONGODB_URI);

    if (auditAllImages) {
        await auditOldImageReferences();
        return;
    }

    if (migrateSecondaryImages) {
        await migrateSecondaryImageReferences();
        return;
    }

    let query = Product.find({ images: { $elemMatch: { $type: 'string' } } })
        .select('_id slug title images')
        .lean();
    if (limit) query = query.limit(limit);

    const products = await query;
    const candidates = products
        .map((product) => ({
            ...product,
            imagesToMigrate: product.images.filter(shouldMigrate)
        }))
        .filter((product) => product.imagesToMigrate.length > 0);
    const uniqueImages = new Set(candidates.flatMap((product) => product.imagesToMigrate.map(toSourceUrl)));

    console.log(`Rejim: ${applyChanges ? 'APPLY' : 'DRY RUN'}`);
    console.log(`Ko‘chiriladigan productlar: ${candidates.length}`);
    console.log(`Noyob rasmlar: ${uniqueImages.size}`);
    console.log(`Eski rasm manzili: ${oldImageBaseUrl}`);
    console.log(`Cloudinary papkasi: ${cloudinaryFolder}`);
    if (applyChanges) console.log(`Parallel uploadlar: ${concurrency}`);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const inventory = candidates.map((product) => ({
        productId: String(product._id),
        slug: product.slug,
        images: product.images,
        imagesToMigrate: product.imagesToMigrate.map(toSourceUrl)
    }));
    writeJson(`product-images-inventory-${timestamp}.json`, inventory);

    if (!applyChanges) {
        console.log('Hech narsa upload qilinmadi va baza o‘zgartirilmadi. Davom etish uchun --apply ishlating.');
        return;
    }

    const uploadedBySource = new Map();
    const report = [];
    const checkpointPath = path.join(outputDirectory, `product-images-checkpoint-${timestamp}.jsonl`);
    let completedCount = 0;

    const uploadImage = async (imageValue) => {
        const sourceUrl = toSourceUrl(imageValue);
        if (uploadedBySource.has(sourceUrl)) return uploadedBySource.get(sourceUrl);

        const uploadPromise = cloudinary.uploader.upload(sourceUrl, {
            folder: cloudinaryFolder,
            public_id: toPublicId(sourceUrl),
            overwrite: false,
            resource_type: 'image'
        });
        uploadedBySource.set(sourceUrl, uploadPromise);
        return uploadPromise;
    };

    const migrateProduct = async (product, index) => {
        const before = [...product.images];
        let reportItem;
        try {
            const after = [];
            const uploads = [];

            for (const image of before) {
                if (!shouldMigrate(image)) {
                    after.push(image);
                    continue;
                }

                const uploaded = await uploadImage(image);
                after.push(uploaded.secure_url);
                uploads.push({
                    from: toSourceUrl(image),
                    to: uploaded.secure_url,
                    publicId: uploaded.public_id
                });
            }

            const updateResult = await Product.updateOne({ _id: product._id, images: before }, { $set: { images: after } });
            if (updateResult.matchedCount !== 1) {
                throw new Error('Product migratsiya vaqtida o‘zgargan; xavfsizlik uchun DB update bekor qilindi');
            }

            reportItem = { productId: String(product._id), slug: product.slug, status: 'updated', before, after, uploads };
        } catch (error) {
            reportItem = {
                productId: String(product._id),
                slug: product.slug,
                status: 'failed',
                before,
                error: error instanceof Error ? error.message : String(error)
            };
            console.error(`XATO: ${product.slug} — ${reportItem.error}`);
        }

        report[index] = reportItem;
        fs.appendFileSync(checkpointPath, `${JSON.stringify(reportItem)}\n`, 'utf8');
        completedCount += 1;
        if (completedCount % 25 === 0 || completedCount === candidates.length) {
            console.log(`[${completedCount}/${candidates.length}] product qayta ishlandi`);
        }
    };

    let nextIndex = 0;
    const worker = async () => {
        while (nextIndex < candidates.length) {
            const index = nextIndex;
            nextIndex += 1;
            await migrateProduct(candidates[index], index);
        }
    };

    await Promise.all(Array.from({ length: Math.min(concurrency, candidates.length) }, () => worker()));
    writeJson(`product-images-report-${timestamp}.json`, report);

    const updated = report.filter((item) => item.status === 'updated').length;
    const failed = report.filter((item) => item.status === 'failed').length;
    console.log(`Yakunlandi. Yangilandi: ${updated}; xato: ${failed}.`);

    if (failed) process.exitCode = 1;
};

main()
    .catch((error) => {
        console.error(error instanceof Error ? error.message : error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect().catch(() => undefined);
    });
