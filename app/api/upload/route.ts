import { NextRequest, NextResponse } from 'next/server';
import {
  insertFileData,
  getFileById,
  deleteFileById,
  updateFileName,
} from '@/lib/db';
import { validateDrivingData, type DrivingData } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const content = await file.text();
    
    // Validate JSON format and schema
    const validation = validateDrivingData(content);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const data = validation.data as DrivingData;
    console.log('Uploading file data:', data);

    // Store metadata for quick access
    const metadata = JSON.stringify({
      driverName: data.driverName,
      carModel: data.carModel,
      startLocation: data.startLocation ? {
        city: data.startLocation.city,
        district: data.startLocation.district,
        street: data.startLocation.street
      } : null,
      endLocation: data.endLocation ? {
        city: data.endLocation.city,
        district: data.endLocation.district,
        street: data.endLocation.street
      } : null,
    });
    console.log('Generated metadata:', JSON.parse(metadata));

    const fileId = insertFileData(file.name, content, metadata);

    return NextResponse.json({ fileId, message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json(
        { error: 'No file ID provided' },
        { status: 400 }
      );
    }

    const file = getFileById(parseInt(fileId));
    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(file);
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json(
        { error: 'No file ID provided' },
        { status: 400 }
      );
    }

    const success = deleteFileById(parseInt(fileId));
    if (!success) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');
    const body = await request.json();
    const { newName } = body;

    if (!fileId || !newName) {
      return NextResponse.json(
        { error: 'File ID and new name are required' },
        { status: 400 }
      );
    }

    const success = updateFileName(parseInt(fileId), newName);
    if (!success) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'File renamed successfully' });
  } catch (error) {
    console.error('Rename error:', error);
    return NextResponse.json(
      { error: 'Failed to rename file' },
      { status: 500 }
    );
  }
} 