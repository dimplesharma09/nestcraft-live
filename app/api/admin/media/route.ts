import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { connectTenantDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files: any[] = formData.getAll("files") as any[];
    const name: string[] = formData.getAll("name") as string[];
    const altText: string[] = formData.getAll("altText") as string[];
    const foldername: string[] = formData.getAll("foldername") as string[];

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    let array: any[] = [];

    for (let i = 0; i < files.length; i++) {
      const singleFile = files[i];
      const singleName = name[i];
      const singleAltText = altText[i];
      const singleFoldername = foldername[i];
      const filename: string = singleName
        ? singleName
        : `media-${Date.now()}-${singleFile.name}`;
      const buffer: Buffer = Buffer.from(await singleFile.arrayBuffer());
      fs.promises
        .writeFile(path.join(uploadDir, filename), buffer)
        .then(() => {
          array.push({
            filename: filename,
            alt: singleAltText,
            foldername: singleFoldername,
            url: `/uploads/${filename}`,
            size: 2413,
            type: "image",
            createdAt: new Date(),
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    console.log("array", array);

    if (array.length > 0) {
      const mediaColl = await connectTenantDB();
      const result = await mediaColl.collection("media");
      const insertResult = await result.insertMany(array);
      array = array.map((item: any, index: number) => {
        item.id = insertResult.insertedIds[index];
        return item;
      });
    }

    console.log("array later", array);

    return NextResponse.json({ success: true, data: array });
  } catch (error) {
    console.error("Error uploading media:", error);
    return NextResponse.json(
      { error: "Failed to upload media" },
      { status: 500 },
    );
  }
}
