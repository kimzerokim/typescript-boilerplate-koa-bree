export const roundDecimalPoint = (input: number, decimal: number) => {
  return Math.round(input * Math.pow(10, decimal)) / Math.pow(10, decimal);
};

export const floorDecimalPoint = (input: number, decimal: number) => {
  return Math.floor(input * Math.pow(10, decimal)) / Math.pow(10, decimal);
};

export const ceilDecimalPoint = (input: number, decimal: number) => {
  return Math.ceil(input * Math.pow(10, decimal)) / Math.pow(10, decimal);
};
