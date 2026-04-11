// Tests for pure helper functions in Home.jsx
// Run with: npx vitest run src/tests/home.helpers.test.js

import { describe, it, expect } from 'vitest';

// --- copied logic from Home.jsx ---
function isValidImageValue(value) {
    if (!value || typeof value !== 'string') return false;
    const trimmed = value.trim();
    return trimmed.startsWith('http://') || trimmed.startsWith('https://') ||
           trimmed.startsWith('/') || trimmed.startsWith('data:image/');
}

function isInQueue(book, userId) {
    if (!userId || !book.queue) return false;
    return book.queue.some(q => q.userId?.toString() === userId.toString());
}

function isReservedForMe(book, userId) {
    if (!userId || !book.reservedFor?.userId) return false;
    return book.reservedFor.userId.toString() === userId.toString();
}

function isBorrowedByMe(book, userId) {
    if (!userId || !book.borrowedBy) return false;
    const borrowedById = book.borrowedBy?._id?.toString() || book.borrowedBy?.toString();
    return borrowedById === userId.toString();
}

function reservationTimeLeft(book) {
    if (!book.reservedFor?.expiresAt) return null;
    const diff = new Date(book.reservedFor.expiresAt) - new Date();
    if (diff <= 0) return null;
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    return `${hours}h ${mins}m`;
}

// --- tests ---

describe('isValidImageValue', () => {
    it('accepts http url', () => {
        expect(isValidImageValue('http://example.com/img.jpg')).toBe(true);
    });
    it('accepts https url', () => {
        expect(isValidImageValue('https://example.com/img.jpg')).toBe(true);
    });
    it('accepts base64 data uri', () => {
        expect(isValidImageValue('data:image/png;base64,abc123')).toBe(true);
    });
    it('accepts relative path', () => {
        expect(isValidImageValue('/images/cover.jpg')).toBe(true);
    });
    it('rejects empty string', () => {
        expect(isValidImageValue('')).toBe(false);
    });
    it('rejects null', () => {
        expect(isValidImageValue(null)).toBe(false);
    });
    it('rejects random string', () => {
        expect(isValidImageValue('notanimage')).toBe(false);
    });
});

describe('isInQueue', () => {
    const userId = 'user123';
    it('returns true if user is in queue', () => {
        const book = { queue: [{ userId: 'user123' }, { userId: 'other' }] };
        expect(isInQueue(book, userId)).toBe(true);
    });
    it('returns false if user is not in queue', () => {
        const book = { queue: [{ userId: 'other' }] };
        expect(isInQueue(book, userId)).toBe(false);
    });
    it('returns false if queue is empty', () => {
        const book = { queue: [] };
        expect(isInQueue(book, userId)).toBe(false);
    });
    it('returns false if no userId', () => {
        const book = { queue: [{ userId: 'user123' }] };
        expect(isInQueue(book, null)).toBe(false);
    });
});

describe('isReservedForMe', () => {
    const userId = 'user123';
    it('returns true when reserved for current user', () => {
        const book = { reservedFor: { userId: 'user123' } };
        expect(isReservedForMe(book, userId)).toBe(true);
    });
    it('returns false when reserved for another user', () => {
        const book = { reservedFor: { userId: 'other456' } };
        expect(isReservedForMe(book, userId)).toBe(false);
    });
    it('returns false when no reservation', () => {
        const book = { reservedFor: { userId: null } };
        expect(isReservedForMe(book, userId)).toBe(false);
    });
});

describe('isBorrowedByMe', () => {
    const userId = 'user123';
    it('returns true when borrowed by current user (string)', () => {
        const book = { borrowedBy: 'user123' };
        expect(isBorrowedByMe(book, userId)).toBe(true);
    });
    it('returns true when borrowed by current user (object)', () => {
        const book = { borrowedBy: { _id: 'user123' } };
        expect(isBorrowedByMe(book, userId)).toBe(true);
    });
    it('returns false when borrowed by another user', () => {
        const book = { borrowedBy: 'other456' };
        expect(isBorrowedByMe(book, userId)).toBe(false);
    });
    it('returns false when not borrowed', () => {
        const book = { borrowedBy: null };
        expect(isBorrowedByMe(book, userId)).toBe(false);
    });
});

describe('reservationTimeLeft', () => {
    it('returns null if no expiry', () => {
        expect(reservationTimeLeft({ reservedFor: {} })).toBe(null);
    });
    it('returns null if already expired', () => {
        const past = new Date(Date.now() - 1000).toISOString();
        expect(reservationTimeLeft({ reservedFor: { expiresAt: past } })).toBe(null);
    });
    it('returns formatted time for future expiry', () => {
        const future = new Date(Date.now() + 2 * 60 * 60 * 1000 + 30 * 60 * 1000); // 2h 30m from now
        const result = reservationTimeLeft({ reservedFor: { expiresAt: future } });
        expect(result).toBe('2h 30m');
    });
});
