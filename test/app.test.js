import supertest from 'supertest';
import app from '../src/app';
import { isValidTitle } from '../src/utils/validator';

describe("isValidTitle", () => {
  test("returns true for a valid title", () => {
    expect(isValidTitle("Go to gym!")).toBe(true);
  });

  test("returns false for whitespace-only title", () => {
    expect(isValidTitle(" ")).toBe(false);
  });
  test("returns false for null title", () => {
    expect(isValidTitle()).toBe(false);
  });

  test("returns false for undefined title", () => {
    expect(isValidTitle(undefined)).toBe(false);
  });

  test("returns false for too long title", () => {
    expect(isValidTitle("a".repeat(51))).toBe(false);
  });

  test("returns true for max allowed length", () => {
    expect(isValidTitle("a".repeat(50))).toBe(true);
  });
  test("returns true for valid title with surrounding spaces", () => {
  expect(isValidTitle("   Go to gym!   ")).toBe(true);
  });
});