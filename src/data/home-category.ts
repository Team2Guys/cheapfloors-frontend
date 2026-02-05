export const getSubcategoryOrder = (name: string) => {
  const lower = name.toLowerCase();

  if (lower.includes('polar spc herringbone')) return 2;
  if (lower.includes('polar spc')) return 1;
  if (lower.includes('polar lvt')) return 3;

  if (lower.includes('richmond spc herringbone')) return 4;
  if (lower.includes('richmond spc prime')) return 4;
  if (lower.includes('richmond spc eco')) return 3;
  if (lower.includes('richmond spc')) return 4;

  // Specific Richmond LVT types
  if (lower.includes('richmond lvt comfort')) return 5;
  if (lower.includes('richmond lvt luxury')) return 5;
  if (lower.includes('richmond lvt')) return 6;

  return 999;
};

export const whatAmISorting = [
  'Polar SPC Eco',
  'Polar SPC Herringbone',
  'Polar LVT Comfort',
  'Richmond SPC Eco',
  'Richmond SPC Prime',
  'Richmond SPC Herringbone',
  'Richmond LVT Comfort',
  'Richmond LVT Luxury'
];
