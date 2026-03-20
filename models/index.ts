import mongoose from "mongoose";
import { connectMasterDB, connectTenantDB } from "../lib/db";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: String,
  role: String,
}, { strict: false }); // Allow arbitrary fields from the existing collection just in case

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  type: String,
  parentId: String,
  description: String,
  page: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

const attributeSetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true, unique: true },
  appliesTo: String,
  contexts: [String],
  attributes: [mongoose.Schema.Types.Mixed],
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  type: String,
  status: { type: String, default: "active" },
  price: Number,
  description: String,
  categoryIds: [String],
  attributeSetIds: [String],
  gallery: [mongoose.Schema.Types.Mixed],
  pricing: mongoose.Schema.Types.Mixed,
  options: [mongoose.Schema.Types.Mixed],
}, { timestamps: true });

const variantSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  sku: { type: String, required: true, unique: true },
  title: String,
  price: Number,
  stock: Number,
  optionValues: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  orderNumber: String,
  customerId: String,
  status: String,
  paymentStatus: String,
  total: Number,
  items: [mongoose.Schema.Types.Mixed],
  customer: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

export const getMasterModel = async <T = any>(modelName: string, schema: mongoose.Schema) => {
  const conn = await connectMasterDB();
  return conn.models[modelName] || conn.model<T>(modelName, schema);
};

export const getTenantModel = async <T = any>(modelName: string, schema: mongoose.Schema) => {
  const conn = await connectTenantDB();
  return conn.models[modelName] || conn.model<T>(modelName, schema);
};

export const getUserModel = () => getMasterModel("User", userSchema);
export const getCategoryModel = () => getTenantModel("Category", categorySchema);
export const getAttributeSetModel = () => getTenantModel("AttributeSet", attributeSetSchema);
export const getProductModel = () => getTenantModel("Product", productSchema);
export const getVariantModel = () => getTenantModel("Variant", variantSchema);
export const getOrderModel = () => getTenantModel("Order", orderSchema);
