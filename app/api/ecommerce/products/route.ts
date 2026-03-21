import { NextResponse } from "next/server";
import { getProductModel, getVariantModel } from "@/models";
import { authenticateAdmin } from "@/lib/auth";



export async function GET(req: Request) {
  const auth = await authenticateAdmin();

  console.log("auth", auth);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const search = url.searchParams.get("search");
  const category = url.searchParams.get("category");
  const status = url.searchParams.get("status");
  const type = url.searchParams.get("type");

  const query: any = {};
  if (search) query.name = { $regex: search, $options: "i" };
  if (category) query.categoryIds = category;
  if (status) query.status = status;
  if (type) query.type = type;

  try {
    const Product = await getProductModel();
    const Variant = await getVariantModel();
    const products = await Product.find(query).toArray();

    // Enrich with variant count
    const enriched = await Promise.all(products.map(async (p: any) => {
      const variants = await Variant.find({ productId: p._id }).toArray();
      return {
        ...p,
        variantCount: variants.length,
        totalStock: variants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0),
        variants
      };
    }));

    return NextResponse.json(enriched);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await authenticateAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const Product = await getProductModel();
    const Variant = await getVariantModel();

    if (!body.name || !body.sku) {
      return NextResponse.json({ error: "Name and SKU are required" }, { status: 400 });
    }

    const productDoc = {
      name: body.name,
      sku: body.sku,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: body.price || body.pricing?.price,
      description: body.description,
      type: body.type || 'physical',
      status: body.status || 'draft',
      categoryIds: body.categoryIds || [],
      attributeSetIds: body.attributeSetIds || [],
      gallery: body.gallery || [],
      pricing: body.pricing || {},
      options: body.options || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const insertResult = await Product.insertOne(productDoc);
    const productId = insertResult.insertedId;

    if (body.variants && Array.isArray(body.variants)) {
      for (const v of body.variants) {
        await Variant.insertOne({
          productId: productId,
          sku: v.sku,
          title: v.title,
          price: v.price || productDoc.price,
          stock: v.stock || 0,
          optionValues: v.optionValues || {},
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    return NextResponse.json({ success: true, productId: productId, slug: productDoc.slug, message: "Product created" });
  } catch (error: any) {
    if (error.code === 11000) return NextResponse.json({ error: "Conflict: Duplicate slug or sku" }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
