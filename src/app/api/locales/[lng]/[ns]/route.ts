import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lng: string; ns: string }> }
) {
  try {
    const resolvedParams = await params;
    const { lng, ns } = resolvedParams;

    const supportedLngs = ['en', 'ru'];
    const supportedNs = ['common'];

    if (!supportedLngs.includes(lng) || !supportedNs.includes(ns)) {
      return new NextResponse('Language or namespace not supported', {
        status: 404,
      });
    }

    const filePath = path.join(
      process.cwd(),
      'public',
      'locales',
      lng,
      `${ns}.json`
    );

    if (!fs.existsSync(filePath)) {
      return new NextResponse('Translation file not found', { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonContent = JSON.parse(fileContent);

    return NextResponse.json(jsonContent, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    throw new Error(`Error serving translation file: ${error}`);
  }
}
