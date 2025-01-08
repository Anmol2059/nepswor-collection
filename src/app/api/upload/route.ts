import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('audio') as File;

  if (file) {
    const buffer = await file.arrayBuffer();
    const filePath = path.join(process.cwd(), 'public', 'uploads', file.name);

    // Save the file
    fs.writeFileSync(filePath, Buffer.from(buffer));
    return NextResponse.json({ message: 'File uploaded successfully!' });
  }

  return NextResponse.json({ message: 'No file uploaded.' }, { status: 400 });
}
