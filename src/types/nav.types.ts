// export interface ICategory {
//     _id: string;
//     name: { uz: string; ru: string };
//     slug: string;
//     icon?: string;
//     image?: string;
//     count?: number;
// }

export type NavItem = {
    label: string;
    href: string;
    icon: React.ReactNode;
    description?: string;
    color?: string;
    highlight?: boolean;
};