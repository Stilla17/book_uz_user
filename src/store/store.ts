import { configureStore } from '@reduxjs/toolkit';

import globalReducer from './features/globalSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            global: globalReducer
        }
    });
};

// Type lar
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
