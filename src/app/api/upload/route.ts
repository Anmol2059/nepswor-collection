import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('audio') as File;
    const directory = formData.get('directory') as string;

    if (!file || !directory) {
      return NextResponse.json({ message: 'Invalid data: Missing file or directory.' }, { status: 400 });
    }

    // Convert audio to a buffer
    const buffer = await file.arrayBuffer();

    // Ensure the directory exists
    const uploadPath = path.join(process.cwd(), 'public', directory);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Create unique file path
    const filePath = path.join(uploadPath, file.name);
    if (fs.existsSync(filePath)) {
      return NextResponse.json({ message: 'File already exists.' }, { status: 409 });
    }

    // Save the file
    fs.writeFileSync(filePath, Buffer.from(buffer));

    return NextResponse.json({ message: 'File uploaded successfully!', filePath });
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
