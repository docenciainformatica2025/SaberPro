import '@testing-library/jest-dom';

// Mock WebCrypto for JSDOM
if (typeof window !== 'undefined') {
    if (!window.crypto) {
        (window as any).crypto = {};
    }
    if (!window.crypto.getRandomValues) {
        (window as any).crypto.getRandomValues = (arr: any) => {
            const buf = require('crypto').randomBytes(arr.byteLength);
            arr.set(new Uint8Array(buf));
            return arr;
        };
    }
}
