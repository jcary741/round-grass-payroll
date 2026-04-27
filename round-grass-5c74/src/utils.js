export const formatDate = value => new Date(value).toISOString().split('T')[0];
export const formatCurrency = value => `$${value.toFixed(2)}`;
export const formatHours = value => `${value.toFixed(2)} hours`;
export const median = values => {
    if (!values.length) {
        return 0;
    }

    const sorted = [...values].sort((a, b) => a - b);
    const midpoint = Math.floor(sorted.length / 2);

    return sorted.length % 2 === 0
        ? (sorted[midpoint - 1] + sorted[midpoint]) / 2
        : sorted[midpoint];
};