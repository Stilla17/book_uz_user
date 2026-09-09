export const SALES_BRANCHES = [
    { id: '8cac779b-ab52-11ec-0a80-09ec0007a15e', name: "Toshkent - Qatortol - bosh do'kon" },
    { id: '9a503767-453b-11f0-0a80-0f9d0033e459', name: 'Toshkent - Chorsu filial' },
    { id: '257a3813-2da2-11f1-0a80-074c0007a4cf', name: 'Toshkent - Qoramish', aliases: ['Toshkent - Qoraqamish'] },
    { id: '10b98052-ba4e-11ec-0a80-050e0009d3d8', name: "Farg'ona filial" },
    { id: '0664e7c5-f232-11ec-0a80-09850011c255', name: 'Navoiy filial' },
    { id: 'a0541343-5dbc-11f1-0a80-19be00363869', name: 'Qarshi 2-filial' },
    { id: '3bd5dee6-7f27-11ef-0a80-05c000498859', name: 'Namangan filial' },
    { id: '1a95712f-5b2a-11f1-0a80-159600044b37', name: 'Buxoro filial' }
];

const normalizeBranchName = (name: string) =>
    name
        .trim()
        .toLowerCase()
        .replace(/^\d+\s+/, '')
        .replace(/[‘’ʻʼ`]/g, "'")
        .replace(/\s+/g, ' ');

export const findSalesBranch = (href?: string, name = '') => {
    const id = href?.split('/').pop()?.split('?')[0];
    return (
        SALES_BRANCHES.find((branch) => branch.id === id) ??
        SALES_BRANCHES.find((branch) =>
            [branch.name, ...(branch.aliases ?? [])].some(
                (alias) => normalizeBranchName(alias) === normalizeBranchName(name)
            )
        )
    );
};
