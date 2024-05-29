export function domainExpirationDate(years: any): Date {
  const currentDate = new Date();
  console.log(currentDate);
  
  currentDate.setFullYear(currentDate.getFullYear() + years);
  return currentDate;
}