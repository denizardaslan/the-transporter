import { NextResponse } from 'next/server';
import { getFileById, getAllFiles } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('fileId');

  try {
    if (fileId) {
      // Get single trip
      const file = getFileById(parseInt(fileId));
      if (!file) {
        return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
      }
      return NextResponse.json(file);
    } else {
      // Get all trips
      const files = getAllFiles();
      return NextResponse.json(files);
    }
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
  }
} 