import type { Env } from "../lib/env";
import { insertDiagnosis, userFromAccessToken } from "../lib/supabase";

const MAX_BYTES = 8 * 1024 * 1024;
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
};

// Stores a diagnosis photo in R2 and a row in Supabase. The AI result is filled in later.
export async function onRequestPost(context: { request: Request; env: Env }) {
  const { env, request } = context;
  const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return Response.json({ error: "Sign in required" }, { status: 401 });

  const user = await userFromAccessToken(env, token);
  if (!user) return Response.json({ error: "Invalid session" }, { status: 401 });
  if (!env.DIAGNOSES) return Response.json({ error: "Image storage is not configured" }, { status: 503 });

  const form = await request.formData();
  const file = form.get("image");
  if (!(file instanceof File)) return Response.json({ error: "Missing image" }, { status: 400 });
  const extension = TYPES[file.type];
  if (!extension) return Response.json({ error: "Use a JPEG, PNG, WebP or HEIC photo" }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: "Photo must be under 8 MB" }, { status: 413 });

  const plantSlug = form.get("plant_slug");
  const key = `${user.id}/${crypto.randomUUID()}.${extension}`;
  await env.DIAGNOSES.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });

  const diagnosis = await insertDiagnosis(env, {
    user_id: user.id,
    plant_slug: typeof plantSlug === "string" && plantSlug ? plantSlug : null,
    image_key: key,
  });

  return Response.json({ id: diagnosis?.id, image_key: key }, { status: 201 });
}
