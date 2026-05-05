import { configureStore } from '@reduxjs/toolkit';

import cartReducer from './features/cartSlice';
import checkoutReducer from './features/checkoutSlice';
import globalReducer from './features/globalSlice';
import wishlistReducer from './features/wishlistSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            global: globalReducer,
            cart: cartReducer,
            wishlist: wishlistReducer,
            checkout: checkoutReducer
        }
    });
};

// Type lar
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
