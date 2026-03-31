import supertest from 'supertest';
import app from '../src/app';
import { isValidTitle, isValidDesc, isValidEmail, isValidPriority } from '../src/utils/validator';

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

  test("returns false for non-string input", () => {  
  expect(isValidTitle(123)).toBe(false);
  });
  
});


describe("isValidDescription", () => {

  test("returns true for a valid description", () => {
    expect(isValidDesc("Buy milk")).toBe(true);
  });

  test("returns false for whitespace-only description", () => {
    expect(isValidDesc(" ")).toBe(false);
  });

  test("returns false for null description", () => {
    expect(isValidDesc(null)).toBe(false);
  });


  test("returns false for undefined description", () => {
    expect(isValidDesc(undefined)).toBe(false);
  });

  test("returns false for too long description", () => {
    expect(isValidDesc("a".repeat(301))).toBe(false);
  });

  test("returns true for max allowed length", () => {
    expect(isValidDesc("a".repeat(300))).toBe(true);
  });

  test("returns false for too short length", () => {
    expect(isValidDesc("a".repeat(4))).toBe(false);
  });

  test("returns true for valid description with surrounding spaces", () => {
  expect(isValidDesc("   Buy milk   ")).toBe(true);
  });

  test("returns false for non-string input", () => {
  expect(isValidDesc(123)).toBe(false);
  });
  
});


describe("isValidEmail", () => {

  test("returns true for a valid email", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
  });

  test("returns false for an invalid email", () => {
    expect(isValidEmail("invalid-email")).toBe(false);
  });

  test("returns false for non-string input", () => {
    expect(isValidEmail(123)).toBe(false);
  });

  test("returns false for empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });

  test("returns false for whitespace-only string", () => {
    expect(isValidEmail("   ")).toBe(false);
  });

  test("returns true for valid email with surrounding spaces", () => {
    expect(isValidEmail("  user@example.com  ")).toBe(true);
  });
  
  test("return false input without @ symbol", () => {
    expect(isValidEmail("userexample.com")).toBe(false);
  });

  test("return false input without domain", () => {
    expect(isValidEmail("user@")).toBe(false);
  });

});


describe("isValidPriority", () => {

  test("returns true for valid priority", () => {
    expect(isValidPriority("Low")).toBe(true);
    expect(isValidPriority("Medium")).toBe(true);
    expect(isValidPriority("High")).toBe(true);
  });

  test("returns true for empty priority", () => {
    expect(isValidPriority("")).toBe(true);
  });

  test("returns false for whitespace-only priority", () => {
    expect(isValidPriority(" ")).toBe(false);
  }); 

  test("returns false for invalid priority", () => {
    expect(isValidPriority("Urgent")).toBe(false);
    expect(isValidPriority("low")).toBe(false);
    expect(isValidPriority("MEDIUM")).toBe(false);
  });

  test("returns false for non-string input", () => {
    expect(isValidPriority(123)).toBe(false);
  }); 

});