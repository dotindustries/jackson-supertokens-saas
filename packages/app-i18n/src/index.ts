export * from './provider'

export const formatNumber = (value: number, currency: string, fractions = 2) => `${value.toFixed(fractions)} ${currency}`
