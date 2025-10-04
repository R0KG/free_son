import { UserSelection, Project } from '@/types';

export interface SavedSelection extends UserSelection {
  id: string;
  createdAt: string;
  updatedAt: string;
  contactInfo?: {
    name: string;
    phone: string;
    email: string;
  };
  bookingInfo?: {
    date: string;
    time: string;
  };
}

// In-memory storage for MVP (replace with Google Sheets/Airtable in production)
let selections: SavedSelection[] = [];

export const saveSelection = async (
  selection: UserSelection,
  contactInfo?: { name: string; phone: string; email: string },
  bookingInfo?: { date: string; time: string }
): Promise<SavedSelection> => {
  const id = generateUniqueId();
  const now = new Date().toISOString();

  const savedSelection: SavedSelection = {
    ...selection,
    id,
    createdAt: now,
    updatedAt: now,
    contactInfo,
    bookingInfo,
  };

  selections.push(savedSelection);

  // In production, this would save to Google Sheets/Airtable
  console.log('Saving selection to storage:', savedSelection);

  return savedSelection;
};

export const getSelection = async (id: string): Promise<SavedSelection | null> => {
  return selections.find(s => s.id === id) || null;
};

export const updateSelection = async (
  id: string,
  updates: Partial<UserSelection>,
  contactInfo?: { name: string; phone: string; email: string },
  bookingInfo?: { date: string; time: string }
): Promise<SavedSelection | null> => {
  const index = selections.findIndex(s => s.id === id);
  if (index === -1) return null;

  const updatedSelection: SavedSelection = {
    ...selections[index],
    ...updates,
    updatedAt: new Date().toISOString(),
    ...(contactInfo && { contactInfo }),
    ...(bookingInfo && { bookingInfo }),
  };

  selections[index] = updatedSelection;

  // In production, this would update Google Sheets/Airtable
  console.log('Updating selection in storage:', updatedSelection);

  return updatedSelection;
};

export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const generateDashboardUrl = (selectionId: string): string => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  return `${baseUrl}/dashboard/${selectionId}`;
};

// Google Sheets integration functions (for future use)
export const saveToGoogleSheets = async (data: any): Promise<void> => {
  // Implementation would use Google Sheets API
  console.log('Would save to Google Sheets:', data);
  throw new Error('Google Sheets integration not implemented in MVP');
};

// Airtable integration functions (for future use)
export const saveToAirtable = async (data: any): Promise<void> => {
  // Implementation would use Airtable API
  console.log('Would save to Airtable:', data);
  throw new Error('Airtable integration not implemented in MVP');
};

// Email notification (for future use)
export const sendNotification = async (selection: SavedSelection): Promise<void> => {
  // Implementation would send email via service like SendGrid or similar
  console.log('Would send notification email for selection:', selection);
  throw new Error('Email service not implemented in MVP');
};

// =========================
// Project in-memory storage (MVP)
// =========================

let projects: Project[] = [];

export const createProject = async (partial: Partial<Project>): Promise<Project> => {
  const now = new Date().toISOString();
  const project: Project = {
    id: generateUniqueId(),
    createdAt: now,
    updatedAt: now,
    name: partial.name,
    selection: partial.selection,
    calculationInput: partial.calculationInput,
    calculationResult: partial.calculationResult,
    progress: partial.progress,
    contact: partial.contact,
  };
  projects.push(project);
  return project;
};

export const getProject = async (id: string): Promise<Project | null> => {
  return projects.find(p => p.id === id) || null;
};

export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project | null> => {
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return null;
  const updated: Project = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  projects[index] = updated;
  return updated;
};

export const listProjects = async (): Promise<Project[]> => {
  return [...projects];
};
