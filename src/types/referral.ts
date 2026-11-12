export interface ReferralStats {
    _id: string;
    name: string;
    code: string;
    isActive: boolean;
    clickCount: number;
    ordersCount: number;
    completedOrders: number;
    customersCount: number;
    revenue: number;
    createdAt: string;
}

export interface ReferralInput {
    name: string;
    code: string;
    isActive?: boolean;
}
