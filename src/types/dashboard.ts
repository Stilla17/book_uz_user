export type AdminOrdersData = {
    orders?: Array<{
        totalAmount?: number;
        paymentStatus?: string;
        paymentType?: string;
        status?: string;
    }>;
    pagination?: {
        total?: number;
        pages?: number;
    };
};
