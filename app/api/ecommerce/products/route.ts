// import { NextResponse } from "next/server";
// import { getProductModel, getVariantModel } from "@/models";
// import { authenticateAdmin } from "@/lib/auth";

// export async function GET(req: Request) {
//   const auth = await authenticateAdmin();

//   if (!auth)
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const url = new URL(req.url);
//   const search = url.searchParams.get("search");
//   const category = url.searchParams.get("category");
//   const status = url.searchParams.get("status");
//   const type = url.searchParams.get("type");

//   const query: any = {};
//   if (search) query.name = { $regex: search, $options: "i" };
//   if (category) query.categoryIds = category;
//   if (status) query.status = status;
//   if (type) query.type = type;

//   try {
//     const Product = await getProductModel();
//     const Variant = await getVariantModel();
//     const products = await Product.find(query).toArray();

//     // Enrich with variant count
//     const enriched = await Promise.all(
//       products.map(async (p: any) => {
//         const variants = await Variant.find({ productId: p._id }).toArray();
//         return {
//           ...p,
//           variantCount: variants.length,
//           totalStock: variants.reduce(
//             (acc: number, v: any) => acc + (v.stock || 0),
//             0,
//           ),
//           variants,
//         };
//       }),
//     );

//     return NextResponse.json(enriched);
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function POST(req: Request) {
//   const auth = await authenticateAdmin();
//   if (!auth)
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   try {
//     const body = await req.json();
//     const Product = await getProductModel();
//     const Variant = await getVariantModel();

//     if (!body.name || !body.sku) {
//       return NextResponse.json(
//         { error: "Name and SKU are required" },
//         { status: 400 },
//       );
//     }

//     const productDoc = {
//       name: body.name,
//       sku: body.sku,
//       slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
//       price: body.price || body.pricing?.price,
//       description: body.description,
//       type: body.type || "physical",
//       status: body.status || "draft",
//       categoryIds: body.categoryIds || body.category_ids || [],
//       primaryCategoryId:
//         body.primaryCategoryId || body.primary_category_id || null,
//       attributeSetIds: body.attributeSetIds || body.attribute_set_ids || [],
//       primaryImageId: body.primaryImageId || body.primary_image_id || "",
//       gallery: body.gallery || [],
//       pricing: body.pricing || {
//         price: body.price || 0,
//         compareAtPrice: body.compare_at_price || 0,
//         costPerItem: body.cost_per_item || 0,
//         chargeTax: body.charge_tax ?? true,
//         trackQuantity: body.track_quantity ?? true,
//       },
//       options: body.options || [],
//       relatedProductIds:
//         body.relatedProductIds || body.related_product_ids || [],
//       templateKey: body.templateKey || body.template_key || "product-split",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const insertResult = await Product.insertOne(productDoc);
//     const productId = insertResult.insertedId;

//     if (body.variants && Array.isArray(body.variants)) {
//       for (const v of body.variants) {
//         await Variant.insertOne({
//           productId: productId,
//           sku: v.sku,
//           title: v.title,
//           price: v.price || productDoc.price || productDoc.pricing?.price,
//           stock: v.stock || 0,
//           compareAtPrice: v.compareAtPrice || 0,
//           cost: v.cost || 0,
//           imageId: v.imageId || "",
//           optionValues: v.optionValues || v.options || {},
//           status: "active",
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         });
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       productId: productId,
//       slug: productDoc.slug,
//       message: "Product created",
//     });
//   } catch (error: any) {
//     if (error.code === 11000)
//       return NextResponse.json(
//         { error: "Conflict: Duplicate slug or sku" },
//         { status: 409 },
//       );
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { connectTenantDB } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const statusFilter = searchParams.get("status");

    const db = await connectTenantDB();
    const productColl = db.collection("products");

    const matchStage: any = {};

    if (search) {
      matchStage.name = { $regex: search, $options: "i" };
    }

    if (statusFilter) {
      matchStage.status = statusFilter;
    }

    const products = await productColl
      .aggregate([
        {
          $match: matchStage,
        },
        {
          $lookup: {
            from: "variants",
            localField: "_id",
            foreignField: "productId",
            as: "variants",
          },
        },
        // Optional: sort variants
        // {
        //   $addFields: {
        //     variants: {
        //       $sortArray: {
        //         input: "$variants",
        //         sortBy: { createdAt: -1 },
        //       },
        //     },
        //   },
        // },
      ])
      .toArray();

    if (products.length === 0) {
      return NextResponse.json(
        { message: "No products found", data: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Products fetched successfully", data: products },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, status: 500 },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await connectTenantDB();
    const productColl = db.collection("products");
    const body = await request.json();
    const variants = body.variants;
    delete body.variants;
    const result = await productColl.insertOne({
      ...body,
      createdAt: new Date(),
    });
    const variantWithId = variants.map((variant: any) => ({
      ...variant,
      productId: result.insertedId,
      _id: new ObjectId(),
      createdAt: new Date(),
    }));
    const variantColl = db.collection("variants");
    await variantColl.insertMany(variantWithId);
    return NextResponse.json(
      {
        message: "Product created successfully",
        data: { ...body, _id: result.insertedId, variants: variantWithId },
        id: null,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, status: 500 },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get("id");
    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required", status: 400 },
        { status: 400 },
      );
    }
    const db = await connectTenantDB();
    const productColl = db.collection("products");
    const body = await request.json();
    const variants = body.variants;
    delete body.variants;
    delete body._id;
    await productColl.updateOne(
      { _id: new ObjectId(productId) },
      { $set: body },
    );
    const variantColl = db.collection("variants");
    const variantDetails = await variantColl
      .find({ productId: new ObjectId(productId) })
      .project({ _id: 1 })
      .toArray();
    const inString = variantDetails.map((variant: any) =>
      variant._id.toString(),
    );

    for (let i of variants) {
      if (inString.includes(i._id)) {
        const id = new ObjectId(i._id);
        delete i._id;
        await variantColl.updateOne(
          { _id: id },
          { $set: { ...i, productId: new ObjectId(productId) } },
        );
      } else {
        const insertedId = await variantColl.insertOne({
          ...i,
          productId: new ObjectId(productId),
          _id: new ObjectId(),
          createdAt: new Date(),
        });
        const index = variants.findIndex(
          (variant: any) => variant._id === i._id,
        );
        variants[index]._id = insertedId.insertedId;
      }
    }

    return NextResponse.json(
      {
        message: "Product updated successfully",
        data: { ...body, _id: body._id, variants: variants },
        id: productId,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, status: 500 },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get("id");
    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required", status: 400 },
        { status: 400 },
      );
    }
    const db = await connectTenantDB();
    const productColl = db.collection("products");
    await productColl.updateOne(
      { _id: new ObjectId(productId) },
      { $set: { status: "archived" } },
    );

    const variantColl = db.collection("variants");
    await variantColl.updateMany(
      { productId: new ObjectId(productId) },
      { $set: { status: "inactive" } },
    );

    return NextResponse.json(
      { message: "Product deleted successfully", status: 200, id: productId },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, status: 500 },
      { status: 500 },
    );
  }
}
