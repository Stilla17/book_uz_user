'use client';

import React, { ReactNode, useRef } from 'react';

import { AppStore, makeStore } from '@/store/store';

import { Provider } from 'react-redux';

const ProviderRedux = ({ children }: { children: ReactNode }) => {
    const storeRef = useRef<AppStore | null>(null);

    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

    return <Provider store={storeRef.current}>{children}</Provider>;
};

export default ProviderRedux;
