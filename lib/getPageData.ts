import { cache } from "react";
import { connectTenantDB } from "./db";

function serialize(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

export const getPageData = cache(async (slug: string) => {
  const db = await connectTenantDB();
  const page = await db.collection("pages").findOne({ slug });

  return serialize(page);
});
