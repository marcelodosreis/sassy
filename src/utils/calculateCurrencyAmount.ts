const currencyRates: { [key: string]: number } = {
    usd: 1,
    brl: 6,
};

export const calculateCurrencyAmount = (amount: string, currency: string = 'usd'): number => {
    const rate = currencyRates[currency.toLowerCase()];

    if (rate === undefined) {
        throw new Error(`Currency not supported: ${currency}`);
    }

    return Number(amount) * rate;
};