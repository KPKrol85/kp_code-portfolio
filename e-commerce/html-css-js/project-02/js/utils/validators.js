export const validators = {
  required: (value) => value && value.trim().length > 0,
  email: (value) => /\S+@\S+\.\S+/.test(value),
  minLength: (length) => (value) => value && value.length >= length,
};
