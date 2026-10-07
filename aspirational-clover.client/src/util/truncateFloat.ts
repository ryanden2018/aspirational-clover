export function truncateFloat(value: number, decimalPlaces: number): number {
    const multiplier = Math.pow(10, decimalPlaces);
    return Math.floor(value * multiplier) / multiplier;
}
