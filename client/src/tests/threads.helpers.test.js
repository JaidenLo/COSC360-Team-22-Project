import { describe, it, expect, vi, beforeEach } from 'vitest';

function canDeletePost(post, userId) {
    if (!userId) return false;
    return post.userId?.toString() === userId?.toString();
}

function isEmptyPost(content) {
    return !content || !content.trim();
}

// --- tests ---

describe('canDeletePost', () => {
    it('returns true when userId matches post userId', () => {
        const post = { userId: 'abc123' };
        expect(canDeletePost(post, 'abc123')).toBe(true);
    });
    it('returns false when userId does not match', () => {
        const post = { userId: 'abc123' };
        expect(canDeletePost(post, 'xyz999')).toBe(false);
    });
    it('returns false when userId is null', () => {
        const post = { userId: 'abc123' };
        expect(canDeletePost(post, null)).toBe(false);
    });
    it('returns false when post has no userId', () => {
        const post = { userId: null };
        expect(canDeletePost(post, 'abc123')).toBe(false);
    });
});

describe('isEmptyPost', () => {
    it('returns true for empty string', () => {
        expect(isEmptyPost('')).toBe(true);
    });
    it('returns true for whitespace only', () => {
        expect(isEmptyPost('   ')).toBe(true);
    });
    it('returns false for valid content', () => {
        expect(isEmptyPost('Hello world')).toBe(false);
    });
    it('returns true for null', () => {
        expect(isEmptyPost(null)).toBe(true);
    });
    it('returns false for content with leading spaces', () => {
        expect(isEmptyPost('  hello')).toBe(false);
    });
});

describe('fetch mock - post thread', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('calls the correct endpoint when posting', async () => {
        const mockFetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ _id: '1', content: 'test', username: 'user1' })
        });
        vi.stubGlobal('fetch', mockFetch);

        await fetch('/api/threads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookId: 'book1', userId: 'user1', username: 'user1', content: 'test' })
        });

        expect(mockFetch).toHaveBeenCalledWith('/api/threads', expect.objectContaining({
            method: 'POST'
        }));
    });

    it('calls delete endpoint with correct thread id', async () => {
        const mockFetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ message: 'deleted' })
        });
        vi.stubGlobal('fetch', mockFetch);

        await fetch('/api/threads/thread123', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'user1' })
        });

        expect(mockFetch).toHaveBeenCalledWith('/api/threads/thread123', expect.objectContaining({
            method: 'DELETE'
        }));
    });
});
