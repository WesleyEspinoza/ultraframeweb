import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

/** Serverless hosts (e.g. Vercel) have a read-only filesystem except /tmp. */
export function canUseLocalDataDir(): boolean {
  if (process.env.DISABLE_LOCAL_DATA === "true") return false;
  if (process.env.VERCEL === "1") return false;
  if (process.env.AWS_LAMBDA_FUNCTION_NAME) return false;
  return true;
}

export function dataFilePath(filename: string): string {
  return path.join(DATA_DIR, filename);
}

export async function readJsonFile<T>(filename: string): Promise<T | null> {
  if (!canUseLocalDataDir()) return null;
  try {
    const raw = await fs.readFile(dataFilePath(filename), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Best-effort write for local dev only; never throws on serverless. */
export async function writeJsonFile(filename: string, data: unknown): Promise<void> {
  if (!canUseLocalDataDir()) return;
  try {
    const filePath = dataFilePath(filename);
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch {
    // Ignore — production uses env vars + Stripe API instead of disk cache.
  }
}
