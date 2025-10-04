import { CalculationInput, CalculationResult, PriceItem, StageEstimate } from '@/types';

// Simple, versioned pricing rules to keep deterministic and testable
export const PRICING_VERSION = '2025-10-01';

type BaseRateMap = {
  [key in CalculationInput['wallMaterial']]: number;
};

const BASE_RATE_PER_M2: BaseRateMap = {
  wood: 75000,
  brick: 95000,
  aerated_concrete: 85000,
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function computeFloorCoefficient(floors: CalculationInput['floors']): number {
  if (floors === 1) return 1.0;
  if (floors === 2) return 1.08;
  return 1.15; // 3 floors
}

function computeFinishMultiplier(level: CalculationInput['finishLevel']): number {
  switch (level) {
    case 'shell':
      return 0.85;
    case 'basic':
      return 1.0;
    case 'turnkey':
      return 1.2;
  }
}

function foundationCost(type: CalculationInput['foundationType'], area: number): PriceItem {
  const unitPrice = type === 'slab' ? 18000 : type === 'strip' ? 14000 : 12000; // pile
  const amount = unitPrice * area;
  return {
    id: `foundation_${type}`,
    label: `Фундамент (${type})`,
    type: 'per_m2',
    unitPrice,
    quantity: area,
    amount,
    category: 'foundation',
  };
}

function engineeringCosts(input: CalculationInput): PriceItem[] {
  const items: PriceItem[] = [];
  const { area, engineeringOptions } = input;

  if (engineeringOptions.includes('heating_radiators')) {
    const unitPrice = 2800;
    items.push({
      id: 'eng_heating',
      label: 'Отопление (радиаторы)',
      type: 'per_m2',
      unitPrice,
      quantity: area,
      amount: unitPrice * area,
      category: 'engineering',
    });
  }
  if (engineeringOptions.includes('warm_floor')) {
    const unitPrice = 1900;
    items.push({
      id: 'eng_warm_floor',
      label: 'Тёплый пол (водяной)',
      type: 'per_m2',
      unitPrice,
      quantity: area * 0.6, // предположим тёплый пол на 60% площади
      amount: unitPrice * area * 0.6,
      category: 'engineering',
    });
  }
  if (engineeringOptions.includes('ventilation')) {
    const amount = 250000;
    items.push({
      id: 'eng_ventilation',
      label: 'Вентиляция приточно-вытяжная',
      type: 'fixed',
      unitPrice: amount,
      amount,
      category: 'engineering',
    });
  }
  if (engineeringOptions.includes('water_supply')) {
    const amount = 180000;
    items.push({
      id: 'eng_water',
      label: 'Водоснабжение',
      type: 'fixed',
      unitPrice: amount,
      amount,
      category: 'engineering',
    });
  }
  if (engineeringOptions.includes('septic')) {
    const amount = 220000;
    items.push({
      id: 'eng_septic',
      label: 'Канализация (септик)',
      type: 'fixed',
      unitPrice: amount,
      amount,
      category: 'engineering',
    });
  }
  if (engineeringOptions.includes('electricity')) {
    const unitPrice = 900;
    items.push({
      id: 'eng_electric',
      label: 'Электрика',
      type: 'per_m2',
      unitPrice,
      quantity: area,
      amount: unitPrice * area,
      category: 'engineering',
    });
  }
  return items;
}

function extrasCosts(input: CalculationInput): PriceItem[] {
  const items: PriceItem[] = [];
  const { area } = input;
  const extras = input.extras ?? [];
  if (extras.includes('terrace')) {
    const unitPrice = 14000;
    const quantity = Math.max(12, Math.min(40, area * 0.2));
    items.push({
      id: 'extra_terrace',
      label: 'Терраса',
      type: 'per_m2',
      unitPrice,
      quantity,
      amount: unitPrice * quantity,
      category: 'extras',
    });
  }
  if (extras.includes('fireplace')) {
    const amount = 180000;
    items.push({
      id: 'extra_fireplace',
      label: 'Камин',
      type: 'fixed',
      unitPrice: amount,
      amount,
      category: 'extras',
    });
  }
  if (extras.includes('panoramic_windows')) {
    const percent = 0.06;
    items.push({
      id: 'extra_panoramic',
      label: 'Панорамное остекление',
      type: 'percent',
      unitPrice: percent,
      amount: 0, // computed later as percent of base
      category: 'extras',
    });
  }
  if (extras.includes('garage')) {
    const amount = 700000;
    items.push({
      id: 'extra_garage',
      label: 'Гараж (пристрой)',
      type: 'fixed',
      unitPrice: amount,
      amount,
      category: 'extras',
    });
  }
  return items;
}

function estimateStages(input: CalculationInput, basePrice: number): StageEstimate[] {
  const floors = input.floors;
  const complexityFactor = floors === 1 ? 1 : floors === 2 ? 1.15 : 1.3;
  const weeks = Math.round((basePrice / 1_000_000) * 3 * complexityFactor);
  const design = clamp(Math.round(weeks * 0.15), 1, 4);
  const foundation = clamp(Math.round(weeks * 0.2), 1, 6);
  const frame = clamp(Math.round(weeks * 0.35), 2, 12);
  const engineering = clamp(Math.round(weeks * 0.15), 1, 6);
  const finishing = clamp(Math.round(weeks * 0.15), 1, 8);
  return [
    { key: 'design', label: 'Проектирование', weeks: design },
    { key: 'foundation', label: 'Фундамент', weeks: foundation },
    { key: 'frame', label: 'Коробка', weeks: frame },
    { key: 'engineering', label: 'Инженерия', weeks: engineering },
    { key: 'finishing', label: 'Отделка', weeks: finishing },
  ];
}

export function computePrice(input: CalculationInput): CalculationResult {
  const area = input.area;
  const baseRate = BASE_RATE_PER_M2[input.wallMaterial];
  const floorCoeff = computeFloorCoefficient(input.floors);
  const finishMult = computeFinishMultiplier(input.finishLevel);
  const promo = input.promoMultiplier ?? 1.0;

  const basePrice = Math.round(area * baseRate * floorCoeff * finishMult);

  const items: PriceItem[] = [];
  // Foundation
  items.push(foundationCost(input.foundationType, area));
  // Engineering
  items.push(...engineeringCosts(input));
  // Extras
  items.push(...extrasCosts(input));

  // Apply percent-type extras on top of base price
  const percentAdd = items
    .filter((i) => i.type === 'percent')
    .reduce((sum, i) => sum + i.unitPrice, 0);
  const percentAmount = Math.round(basePrice * percentAdd);

  // Now set amounts for percent items
  for (const i of items) {
    if (i.type === 'percent') {
      i.amount = Math.round(basePrice * i.unitPrice);
    }
  }

  const itemsTotal = items.reduce((sum, i) => sum + i.amount, 0);
  const totalPrice = Math.round((basePrice + percentAmount + itemsTotal) * promo);

  const stages = estimateStages(input, basePrice);
  const durationWeeks = stages.reduce((sum, s) => sum + s.weeks, 0);

  return {
    pricingVersion: PRICING_VERSION,
    baseRatePerM2: baseRate,
    basePrice,
    items,
    totalPrice,
    stages,
    durationWeeks,
  };
}


