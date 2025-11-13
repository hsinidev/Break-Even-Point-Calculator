
export interface BreakEvenResult {
  breakEvenUnits: number;
  contributionMarginPerUnit: number;
  breakEvenRevenue: number;
}

export interface CalculationError {
  error: string;
}

export function calculateBreakEvenPoint(
  fixedCosts: number,
  sellingPricePerUnit: number,
  variableCostsPerUnit: number
): BreakEvenResult | CalculationError {
  if (isNaN(fixedCosts) || isNaN(sellingPricePerUnit) || isNaN(variableCostsPerUnit)) {
    return { error: "Please enter valid numbers in all fields." };
  }
  
  if (fixedCosts <= 0 || sellingPricePerUnit <= 0) {
    return { error: "Fixed Costs and Selling Price must be positive numbers." };
  }
  
  if (variableCostsPerUnit < 0) {
    return { error: "Variable Costs cannot be negative." };
  }

  const contributionMarginPerUnit = sellingPricePerUnit - variableCostsPerUnit;

  if (contributionMarginPerUnit <= 0) {
    return { error: "Selling price per unit must be greater than variable costs per unit to be profitable." };
  }

  const breakEvenUnits = fixedCosts / contributionMarginPerUnit;
  const breakEvenRevenue = breakEvenUnits * sellingPricePerUnit;

  return {
    breakEvenUnits: Math.ceil(breakEvenUnits), // Round up units to the next whole number
    contributionMarginPerUnit,
    breakEvenRevenue,
  };
}
