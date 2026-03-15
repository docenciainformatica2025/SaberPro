/**
 * Robust date formatting utility for SaberPro
 * Handles Unix timestamps, Firestore Timestamps, and JS Date objects.
 */
export const robustDate = (dateValue: any): Date => {
    if (!dateValue) return new Date();

    // Firestore Timestamp
    if (typeof dateValue === 'object' && 'seconds' in dateValue) {
        return new Date(dateValue.seconds * 1000);
    }

    // JS Date object
    if (dateValue instanceof Date) {
        return dateValue;
    }

    // Unix timestamp (milliseconds or seconds)
    if (typeof dateValue === 'number') {
        // If it's too small, it's likely seconds, not ms
        if (dateValue < 10000000000) {
            return new Date(dateValue * 1000);
        }
        return new Date(dateValue);
    }

    // ISO string or other string format
    return new Date(dateValue);
};

export const formatLongDate = (dateValue: any): string => {
    const date = robustDate(dateValue);
    return date.toLocaleDateString("es-CO", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatShortDate = (dateValue: any): string => {
    const date = robustDate(dateValue);
    return date.toLocaleDateString("es-CO", {
        day: '2-digit',
        month: 'short'
    });
};
