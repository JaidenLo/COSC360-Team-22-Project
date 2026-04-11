import { describe, it, expect } from 'vitest';

function checkPassword(password) {
    const hasNumber = /\d/.test(password);
    return password.length >= 5 && hasNumber;
}

function checkEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function checkCity(city) {
    return city !== "" && /^[a-zA-Z\s]+$/.test(city);
}

function passwordsMatch(password, confirmPassword) {
    return password === confirmPassword;
}

// --- tests ---

describe('checkPassword', () => {
    it('passes with 5+ chars and a number', () => {
        expect(checkPassword('hello1')).toBe(true);
    });
    it('fails if too short', () => {
        expect(checkPassword('ab1')).toBe(false);
    });
    it('fails with no number', () => {
        expect(checkPassword('helloworld')).toBe(false);
    });
    it('fails with empty string', () => {
        expect(checkPassword('')).toBe(false);
    });
    it('passes with exactly 5 chars and a number', () => {
        expect(checkPassword('abcd1')).toBe(true);
    });
});

describe('checkEmail', () => {
    it('passes a valid email', () => {
        expect(checkEmail('user@example.com')).toBe(true);
    });
    it('fails with no @', () => {
        expect(checkEmail('userexample.com')).toBe(false);
    });
    it('fails with no domain', () => {
        expect(checkEmail('user@')).toBe(false);
    });
    it('fails with spaces', () => {
        expect(checkEmail('user @example.com')).toBe(false);
    });
    it('fails with empty string', () => {
        expect(checkEmail('')).toBe(false);
    });
    it('passes with subdomain', () => {
        expect(checkEmail('user@mail.example.com')).toBe(true);
    });
});

describe('checkCity', () => {
    it('passes with a valid city', () => {
        expect(checkCity('Kelowna')).toBe(true);
    });
    it('passes with spaces in city name', () => {
        expect(checkCity('New York')).toBe(true);
    });
    it('fails with numbers', () => {
        expect(checkCity('City123')).toBe(false);
    });
    it('fails with empty string', () => {
        expect(checkCity('')).toBe(false);
    });
    it('fails with special characters', () => {
        expect(checkCity('City!')).toBe(false);
    });
});

describe('passwordsMatch', () => {
    it('passes when passwords match', () => {
        expect(passwordsMatch('hello1', 'hello1')).toBe(true);
    });
    it('fails when passwords differ', () => {
        expect(passwordsMatch('hello1', 'hello2')).toBe(false);
    });
    it('fails when one is empty', () => {
        expect(passwordsMatch('hello1', '')).toBe(false);
    });
    it('is case sensitive', () => {
        expect(passwordsMatch('Hello1', 'hello1')).toBe(false);
    });
});
