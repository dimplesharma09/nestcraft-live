import { connectTenantDB } from "@/lib/db";
import { isHex } from "@/lib/utils";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get("type");
    const includeCounts = searchParams.get("includeCounts");

    const db = await connectTenantDB();
    const categoryColl = db.collection("categories");

    let query: any = {};
    if (type) {
      query.type = type;
    }

    const categories = await categoryColl.find(query).toArray();

    if (categories.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await connectTenantDB();
    const categoryColl = db.collection("categories");

    // Check if slug already exists
    if (body.slug) {
      const existing = await categoryColl.findOne({ slug: body.slug });
      if (existing) {
        return NextResponse.json(
          { error: "A category with this slug already exists" },
          { status: 400 },
        );
      }
    }

    const result = await categoryColl.insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      ...body,
      _id: result.insertedId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    if (!id) {
      // Support both query param and URL segments if needed, here we use query param as per requirements
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const db = await connectTenantDB();
    const categoryColl = db.collection("categories");

    // Remove _id from body if present to avoid Mongo error
    const { _id, ...updateData } = body;

    const normalisesId: any = isHex(id) ? new ObjectId(id) : id;

    const result = await categoryColl.updateOne(
      { _id: normalisesId },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ...updateData,
      _id: id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 },
      );
    }

    const db = await connectTenantDB();
    const categoryColl = db.collection("categories");

    // Check if category has subcategories
    const hasSubcategories = await categoryColl.findOne({ parentId: id });
    if (hasSubcategories) {
      return NextResponse.json(
        { error: "Cannot delete category with subcategories" },
        { status: 400 },
      );
    }

    const idInNormal: any = isHex(id) ? new ObjectId(id) : id;

    const result = await categoryColl.deleteOne({
      _id: idInNormal,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Category deleted successfully",
      data: id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
