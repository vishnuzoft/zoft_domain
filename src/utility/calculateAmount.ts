// export function calculateAmount(years: number): number {
//     const baseRegistrationFeePerYear = 10;
//     const totalRegistrationFee = baseRegistrationFeePerYear * years;
//     return totalRegistrationFee;
//   }

export function calculatePrice(domain: string, years: string): number {
  const yearsAsNumber = parseInt(years, 10);
  if (isNaN(yearsAsNumber) || yearsAsNumber < 1) {
    throw new Error('Invalid years input');
  }
    const basePrice = 10;
    const additionalCost = 2;
    
    const isPremiumDomain = domain.endsWith('.premium');
  
    const totalPrice = (basePrice + (isPremiumDomain ? additionalCost : 0)) * yearsAsNumber;
  
    return totalPrice;
  }
  