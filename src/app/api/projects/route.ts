import { NextRequest, NextResponse } from 'next/server';
import { createProject, getProject, listProjects, updateProject } from '@/lib/dataStorage';
import { rateLimit } from '@/lib/rateLimit';
import { zProject, zProjectCreate } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const rl = rateLimit(request, 'projects_get', 120, 60_000);
    if (!rl.allowed) return rl.response!;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      const project = await getProject(id);
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: project });
    }
    const projects = await listProjects();
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    return NextResponse.json({ error: 'Failed to get projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const rl = rateLimit(request, 'projects_post', 30, 60_000);
    if (!rl.allowed) return rl.response!;
    const body = await request.json();
    const parsed = zProjectCreate.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const created = await createProject(parsed.data);
    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const rl = rateLimit(request, 'projects_patch', 60, 60_000);
    if (!rl.allowed) return rl.response!;
    const body = await request.json();
    const id = body?.id as string | undefined;
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }
    // Best-effort validation of full shape if present
    const shapeValidation = zProject.partial().safeParse(body);
    if (!shapeValidation.success) {
      return NextResponse.json({ error: shapeValidation.error.flatten() }, { status: 400 });
    }
    const updated = await updateProject(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error in PATCH /api/projects:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}


