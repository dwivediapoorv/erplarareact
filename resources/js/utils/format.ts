/**
 * Returns the ordinal suffix for a given day number.
 * Correctly handles 11th, 12th, 13th (not 11st, 12nd, 13rd).
 */
const getOrdinalSuffix = (day: number): string => {
    if (day % 100 >= 11 && day % 100 <= 13) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
};

/**
 * Formats a date string to show the day of the month with ordinal suffix.
 * e.g. "2024-01-15" → "15th of every month"
 */
export const formatMonthlyReportDate = (date: string | null): string => {
    if (!date) return 'N/A';
    const day = new Date(date).getDate();
    return `${day}${getOrdinalSuffix(day)} of every month`;
};
