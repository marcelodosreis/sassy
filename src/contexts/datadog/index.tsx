'use client';

import React, { createContext, useEffect } from 'react';

import { initDatadogRum } from '@/libs/datadog';

const DatadogContext = createContext(null);

const DatadogProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        initDatadogRum();
    }, []);

    return (
        <DatadogContext.Provider value={null}>
            {children}
        </DatadogContext.Provider>
    )
};

export { DatadogProvider }