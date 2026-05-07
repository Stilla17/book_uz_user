import type { Category, SubCategory } from '@/types/category.types';

const getCategoryValue = (category: Pick<Category, '_id' | 'slug'>) => category.slug || category._id || '';
const getSubgenreValue = (subgenre: Pick<SubCategory, '_id' | 'slug'>) => subgenre.slug || subgenre._id || '';

export const getCatalogCategoryHref = (category: Pick<Category, '_id' | 'slug'>) => {
    const categoryValue = getCategoryValue(category);
    return categoryValue ? `/catalog?category=${encodeURIComponent(categoryValue)}` : '/catalog';
};

export const getCatalogSubgenreHref = (
    category: Pick<Category, '_id' | 'slug'>,
    subgenre: Pick<SubCategory, '_id' | 'slug'>
) => {
    const categoryValue = getCategoryValue(category);
    const subgenreValue = getSubgenreValue(subgenre);
    const params = new URLSearchParams();

    if (categoryValue) params.set('category', categoryValue);
    if (subgenreValue) params.set('subgenre', subgenreValue);

    const query = params.toString();
    return query ? `/catalog?${query}` : '/catalog';
};
