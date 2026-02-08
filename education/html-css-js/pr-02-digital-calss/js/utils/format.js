export const formatDate = (iso) => new Date(iso).toLocaleDateString("pl-PL");
export const formatDateTime = (iso) => new Date(iso).toLocaleString("pl-PL");

export const daysFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};
