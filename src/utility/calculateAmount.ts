export function calculateAmount(years: number): number {
    const baseRegistrationFeePerYear = 10;
    const totalRegistrationFee = baseRegistrationFeePerYear * years;
    return totalRegistrationFee;
  }