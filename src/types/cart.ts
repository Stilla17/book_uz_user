export interface CartItem {
    product: {
        _id: string;
        title?: {
            uz?: string;
            ru?: string;
            en?: string;
        };
        price: number;
        images: string[];
        stock: number;
        slug: string;
        format?: 'ebook' | 'audio' | 'paper';
        author?: {
            name: string;
        };
    };
    quantity: number;
    price: number;
    _id: string;
}

export interface Cart {
    _id: string;
    items: CartItem[];
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
}
