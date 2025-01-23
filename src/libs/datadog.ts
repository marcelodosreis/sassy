import { datadogRum } from '@datadog/browser-rum';

export const initDatadogRum = () => {
    if (
        typeof window !== 'undefined' &&
        process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID &&
        process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN
    ) {
        datadogRum.init({
            applicationId: process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID!,
            clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN!,
            // `site` refers to the Datadog site parameter of your organization
            // see https://docs.datadoghq.com/getting_started/site/
            site: 'us5.datadoghq.com',
            service: 'sassy',
            env: process.env.NODE_ENV,
            version: '1.0.0',
            sessionSampleRate: 100,
            sessionReplaySampleRate: 100,
            defaultPrivacyLevel: 'mask-user-input',
        });
    }
};