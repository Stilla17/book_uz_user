import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CheckoutState {
    clientName: string;
    clientPhone: string;
    description: string;
    region: string;
    district: string;
    address: string;
    deliveryMethod: string;
    paymentMethod: string;
}

const initialState: CheckoutState = {
    clientName: '',
    clientPhone: '',
    description: '',
    region: '',
    district: '',
    address: '',
    deliveryMethod: 'Pochta orqali',
    paymentMethod: 'Payme'
};

export const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        updateField: (state, action: PayloadAction<Partial<CheckoutState>>) => {
            return { ...state, ...action.payload };
        },
        resetCheckout: () => initialState
    }
});

export const { updateField, resetCheckout } = checkoutSlice.actions;

export default checkoutSlice.reducer;
