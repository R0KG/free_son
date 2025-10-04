import { google } from 'googleapis';
import { SheetCalculationRow, SheetLeadRow } from '@/types';

export interface SheetsClientOptions {
  spreadsheetId: string;
  calculationsSheetName?: string;
  leadsSheetName?: string;
}

export class SheetsClient {
  private sheets;
  private spreadsheetId: string;
  private calculationsSheet: string;
  private leadsSheet: string;

  constructor(opts: SheetsClientOptions) {
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const privateKey = (process.env.GOOGLE_SHEETS_PRIVATE_KEY || '').replace(/\\n/g, '\n');
    if (!clientEmail || !privateKey) {
      throw new Error('Google Sheets credentials are not configured');
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = opts.spreadsheetId;
    this.calculationsSheet = opts.calculationsSheetName ?? 'Calculations';
    this.leadsSheet = opts.leadsSheetName ?? 'Leads';
  }

  async appendCalculation(row: SheetCalculationRow): Promise<void> {
    const values = [
      [
        row.timestamp,
        row.projectId,
        row.pricingVersion,
        row.area,
        row.floors,
        row.wallMaterial,
        row.foundationType,
        row.finishLevel,
        row.engineeringOptions,
        row.extras,
        row.promoMultiplier,
        row.baseRatePerM2,
        row.basePrice,
        row.totalPrice,
      ],
    ];
    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: `${this.calculationsSheet}!A:N`,
      valueInputOption: 'RAW',
      requestBody: { values },
    });
  }

  async appendLead(row: SheetLeadRow): Promise<void> {
    const values = [
      [
        row.timestamp,
        row.projectId,
        row.name,
        row.phone,
        row.email,
        row.plotId,
        row.houseProjectId,
        row.constructionFormat,
      ],
    ];
    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: `${this.leadsSheet}!A:H`,
      valueInputOption: 'RAW',
      requestBody: { values },
    });
  }
}

export function getSheetsClient(): SheetsClient | null {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) return null;
  try {
    return new SheetsClient({ spreadsheetId });
  } catch (e) {
    console.warn('Sheets client not initialized:', (e as Error).message);
    return null;
  }
}


