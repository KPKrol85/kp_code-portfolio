export const serializeForm = (form) => Object.fromEntries(new FormData(form).entries());
