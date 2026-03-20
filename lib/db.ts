import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

let cachedMaster = (global as any).mongooseMaster;
let cachedTenant = (global as any).mongooseTenant;

if (!cachedMaster) {
  cachedMaster = (global as any).mongooseMaster = { conn: null, promise: null };
}

if (!cachedTenant) {
  cachedTenant = (global as any).mongooseTenant = { conn: null, promise: null };
}

export async function connectMasterDB() {
  if (cachedMaster.conn) return cachedMaster.conn;

  if (!cachedMaster.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "kalp_master",
      serverSelectionTimeoutMS: 5000,
    };
    cachedMaster.promise = mongoose.createConnection(MONGODB_URI!, opts).asPromise();
  }
  
  try {
    cachedMaster.conn = await cachedMaster.promise;
  } catch (e) {
    cachedMaster.promise = null;
    throw e;
  }

  return cachedMaster.conn;
}

export async function connectTenantDB() {
  if (cachedTenant.conn) return cachedTenant.conn;

  if (!cachedTenant.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "kalp_tenant_nestcraft",
      serverSelectionTimeoutMS: 5000,
    };
    cachedTenant.promise = mongoose.createConnection(MONGODB_URI!, opts).asPromise();
  }
  
  try {
    cachedTenant.conn = await cachedTenant.promise;
  } catch (e) {
    cachedTenant.promise = null;
    throw e;
  }

  return cachedTenant.conn;
}
