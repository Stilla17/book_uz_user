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
    promoCode: string;
    promoDiscount: number;
}

const initialState: CheckoutState = {
    clientName: '',
    clientPhone: '',
    description: '',
    region: '',
    district: '',
    address: '',
    deliveryMethod: 'Pochta orqali',
    paymentMethod: 'Payme',
    promoCode: '',
    promoDiscount: 0
};

export const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        updateField: (state, action: PayloadAction<Partial<CheckoutState>>) => {
            return { ...state, ...action.payload };
        },
        setPromo: (state, action: PayloadAction<{ code: string; discount: number }>) => {
            state.promoCode = action.payload.code;
            state.promoDiscount = action.payload.discount;
        },
        clearPromo: (state) => {
            state.promoCode = '';
            state.promoDiscount = 0;
        },
        resetCheckout: () => initialState
    }
});

export const { updateField, resetCheckout, setPromo, clearPromo } = checkoutSlice.actions;

export default checkoutSlice.reducer;
