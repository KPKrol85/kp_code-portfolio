export const uuid = () => {
  const part = () => Math.random().toString(16).slice(2, 10);
  return `id-${part()}-${part()}`;
};
