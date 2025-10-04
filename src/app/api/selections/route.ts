import { NextRequest, NextResponse } from 'next/server';
import { saveSelection, getSelection } from '@/lib/dataStorage';

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

    const savedSelection = await saveSelection(selection, contactInfo, bookingInfo);

    return NextResponse.json({
      success: true,
      data: savedSelection,
      dashboardUrl: `/dashboard/${savedSelection.id}`
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
        { error: 'Selection ID is required' },
        { status: 400 }
      );
    }

    const selection = await getSelection(id);

    if (!selection) {
      return NextResponse.json(
        { error: 'Selection not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: selection
    });
  } catch (error) {
    console.error('Error getting selection:', error);
    return NextResponse.json(
      { error: 'Failed to get selection' },
      { status: 500 }
    );
  }
}
