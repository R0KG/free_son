import { NextRequest, NextResponse } from 'next/server';
import { zCalculationInput } from '@/types';
import { computePrice, PRICING_VERSION } from '@/lib/pricing';
import { getSheetsClient } from '@/lib/sheets';
import { updateProject, getProject } from '@/lib/dataStorage';
import { computeProgress } from '@/lib/progress';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const rl = rateLimit(request, 'calc_post', 60, 60_000);
    if (!rl.allowed) return rl.response!;
    const body = await request.json();
    const inputParse = zCalculationInput.safeParse(body?.input);
    if (!inputParse.success) {
      return NextResponse.json({ error: inputParse.error.flatten() }, { status: 400 });
    }
    const projectId = body?.projectId as string | undefined;
    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    const project = await getProject(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const result = computePrice(inputParse.data);

    // Persist to project store
    const updated = await updateProject(projectId, {
      calculationInput: inputParse.data,
      calculationResult: result,
    });
    if (updated) {
      const progress = computeProgress(updated);
      await updateProject(projectId, { progress });
    }

    // Append to Google Sheets (best effort)
    const sheets = getSheetsClient();
    if (sheets) {
      try {
        await sheets.appendCalculation({
          timestamp: new Date().toISOString(),
          projectId,
          pricingVersion: result.pricingVersion ?? PRICING_VERSION,
          area: inputParse.data.area,
          floors: inputParse.data.floors,
          wallMaterial: inputParse.data.wallMaterial,
          foundationType: inputParse.data.foundationType,
          finishLevel: inputParse.data.finishLevel,
          engineeringOptions: (inputParse.data.engineeringOptions ?? []).join(','),
          extras: (inputParse.data.extras ?? []).join(','),
          promoMultiplier: inputParse.data.promoMultiplier ?? 1,
          baseRatePerM2: result.baseRatePerM2,
          basePrice: result.basePrice,
          totalPrice: result.totalPrice,
        });
      } catch (e) {
        console.warn('Failed to append to Google Sheets:', (e as Error).message);
      }
    }

    return NextResponse.json({ success: true, data: updated ?? { calculationResult: result } });
  } catch (error) {
    console.error('Error in POST /api/calc:', error);
    return NextResponse.json({ error: 'Failed to calculate' }, { status: 500 });
  }
}


