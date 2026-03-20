import { NextResponse } from "next/server";
import { getCategoryModel } from "@/models";
import { authenticate } from "../products/route";

export async function GET(req: Request) {
  const auth = await authenticate();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const type = url.searchParams.get("type");

  const query: any = {};
  if (type) query.type = type;

  try {
    const Category = await getCategoryModel();
    const categories = await Category.find(query).lean();
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await authenticate();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const Category = await getCategoryModel();

    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const category = new Category({
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: body.type || 'product',
      parentId: body.parentId || null,
      description: body.description || '',
      page: body.page || {}
    });

    await category.save();

    return NextResponse.json({ success: true, categoryId: category._id, slug: category.slug, message: "Category created" });
  } catch (error: any) {
    if (error.code === 11000) return NextResponse.json({ error: "Conflict: Duplicate slug" }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
