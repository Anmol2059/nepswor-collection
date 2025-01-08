import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { nickname } = await req.json();
    const filePath = path.join(process.cwd(), "public", "names.txt");

    // Validate nickname
    if (!nickname || typeof nickname !== "string" || nickname.length > 7 || !/^[a-zA-Z]+$/.test(nickname)) {
      return NextResponse.json({ message: "Invalid nickname" }, { status: 400 });
    }

    // Read existing names
    const existingNames = fs.existsSync(filePath)
      ? fs.readFileSync(filePath, "utf-8").split("\n").map((name) => name.trim())
      : [];

    // Check if nickname already exists
    if (existingNames.includes(nickname)) {
      return NextResponse.json({ message: "Nickname already exists" }, { status: 409 });
    }

    // Append the nickname to the file
    fs.appendFileSync(filePath, `${nickname}\n`);
    return NextResponse.json({ message: "Nickname added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error handling nickname:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
