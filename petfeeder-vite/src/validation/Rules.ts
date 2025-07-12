// src/validation/Rules.ts

/**
 * Regex and validation functions for food type and amount.
 */

// Food type: alowed characters are letters (including Polish characters), spaces, and hyphens.
// Minimum length: 2 characters, maximum length: 30 characters.
export const foodTypeRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]{2,30}$/;

// Amount: Positive integers only, no leading zeros.
// Minimum value: 1 gram.
export const amountRegex = /^[1-9]\d*$/;

/**
 * Function validating Food Type
 * @param value - The food type string to validate.
 */
export function validateFoodType(value: string): boolean {
  return foodTypeRegex.test(value.trim());
}

/**
 * Function validating Amount
 * @param value - The amount to validate, can be a number or string.
 */
export function validateAmount(value: number | string): boolean {
  return amountRegex.test(String(value));
}