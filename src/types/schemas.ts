import { z } from 'zod';

export const zCalculationInput = z.object({
  projectName: z.string().min(1).max(120).optional(),
  area: z.number().min(10).max(1000),
  floors: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  wallMaterial: z.enum(['wood', 'brick', 'aerated_concrete']),
  foundationType: z.enum(['slab', 'strip', 'pile']),
  finishLevel: z.enum(['shell', 'basic', 'turnkey']),
  engineeringOptions: z
    .array(
      z.enum([
        'heating_radiators',
        'warm_floor',
        'ventilation',
        'water_supply',
        'septic',
        'electricity',
      ])
    )
    .default([]),
  extras: z.array(z.enum(['terrace', 'fireplace', 'panoramic_windows', 'garage'])).optional(),
  promoMultiplier: z.number().min(0.5).max(1.5).default(1),
});

export const zPriceItem = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['fixed', 'per_m2', 'percent']),
  unitPrice: z.number().nonnegative(),
  quantity: z.number().positive().optional(),
  amount: z.number().nonnegative(),
  category: z.string().optional(),
});

export const zStageEstimate = z.object({
  key: z.enum(['design', 'foundation', 'frame', 'engineering', 'finishing']),
  label: z.string(),
  weeks: z.number().min(0),
});

export const zCalculationResult = z.object({
  pricingVersion: z.string(),
  baseRatePerM2: z.number().nonnegative(),
  basePrice: z.number().nonnegative(),
  items: z.array(zPriceItem),
  totalPrice: z.number().nonnegative(),
  stages: z.array(zStageEstimate),
  durationWeeks: z.number().min(0),
});

export const zProgressState = z.object({
  steps: z.array(
    z.object({
      key: z.enum(['selection', 'parameters', 'summary', 'contacts']),
      label: z.string(),
      completed: z.boolean(),
    })
  ),
  percent: z.number().min(0).max(100),
});

export const zProject = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  name: z.string().optional(),
  selection: z
    .object({
      plotId: z.string().nullable(),
      constructionFormat: z.union([z.literal('self'), z.literal('turnkey')]).nullable(),
      houseProjectId: z.string().nullable(),
      bookingId: z.string().nullable(),
    })
    .optional(),
  calculationInput: zCalculationInput.optional(),
  calculationResult: zCalculationResult.optional(),
  progress: zProgressState.optional(),
  contact: z
    .object({
      name: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email().optional(),
    })
    .optional(),
});

export const zProjectCreate = z.object({
  name: z.string().optional(),
  selection: z
    .object({
      plotId: z.string().nullable(),
      constructionFormat: z.union([z.literal('self'), z.literal('turnkey')]).nullable(),
      houseProjectId: z.string().nullable(),
      bookingId: z.string().nullable(),
    })
    .optional(),
});

export type CalculationInputSchema = z.infer<typeof zCalculationInput>;
export type CalculationResultSchema = z.infer<typeof zCalculationResult>;
export type ProjectSchema = z.infer<typeof zProject>;
export type ProjectCreateSchema = z.infer<typeof zProjectCreate>;


