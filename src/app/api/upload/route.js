import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const data = await req.formData();
    const file = data.get("image");
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadsDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const filename = `${Date.now()}-${file.name}`;
    fs.writeFileSync(path.join(uploadsDir, filename), buffer);
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
};
