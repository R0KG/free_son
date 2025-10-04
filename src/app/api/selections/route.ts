import { NextRequest, NextResponse } from 'next/server';
import { createProject, getProject } from '@/lib/dataStorage';
import { getSheetsClient } from '@/lib/sheets';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { selection, contactInfo, bookingInfo } = body;

    if (!selection) {
      return NextResponse.json(
        { error: 'Selection data is required' },
        { status: 400 }
      );
    }

    const newProject = await createProject({
        selection,
        contact: contactInfo,
    });

    // Append to Google Sheets (best effort)
    const sheets = getSheetsClient();
    if (sheets) {
        try {
            await sheets.appendLead({
                timestamp: new Date().toISOString(),
                projectId: newProject.id,
                name: contactInfo.name,
                phone: contactInfo.phone,
                email: contactInfo.email,
                plotId: selection.plotId,
                houseProjectId: selection.houseProjectId,
                constructionFormat: selection.constructionFormat,
            });
        } catch (e) {
            console.warn('Failed to append lead to Google Sheets:', (e as Error).message);
        }
    }

    return NextResponse.json({
      success: true,
      data: newProject,
      dashboardUrl: `/dashboard/${newProject.id}`
    });
  } catch (error) {
    console.error('Error saving selection:', error);
    return NextResponse.json(
      { error: 'Failed to save selection' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const project = await getProject(id);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error getting project:', error);
    return NextResponse.json(
      { error: 'Failed to get project' },
      { status: 500 }
    );
  }
}
