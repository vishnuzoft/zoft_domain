export function domainExpirationDate(years: number): Date {
  const currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() + years);
  return currentDate;
}