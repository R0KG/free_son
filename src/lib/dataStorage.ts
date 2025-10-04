import { Project } from '@/types';
import fs from 'fs/promises';
import path from 'path';

// Define the path to our persistent data store
const dataPath = path.join(process.cwd(), '.data');
const projectsFilePath = path.join(dataPath, 'projects.json');

// Ensure the data directory exists
const ensureDb = async () => {
    try {
        await fs.access(dataPath);
    } catch {
        await fs.mkdir(dataPath);
    }
};

// Read all projects from the file
const readProjects = async (): Promise<Project[]> => {
    await ensureDb();
    try {
        const fileContent = await fs.readFile(projectsFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        // If the file doesn't exist or is empty, return an empty array
        return [];
    }
};

// Write all projects to the file
const writeProjects = async (projects: Project[]) => {
    await ensureDb();
    await fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2));
};


export const createProject = async (partial: Partial<Project>): Promise<Project> => {
  const projects = await readProjects();
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
  await writeProjects(projects);
  return project;
};

export const getProject = async (id: string): Promise<Project | null> => {
  const projects = await readProjects();
  return projects.find(p => p.id === id) || null;
};

export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project | null> => {
  const projects = await readProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return null;
  const updated: Project = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  projects[index] = updated;
  await writeProjects(projects);
  return updated;
};

export const listProjects = async (): Promise<Project[]> => {
  return await readProjects();
};

export const generateUniqueId = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
