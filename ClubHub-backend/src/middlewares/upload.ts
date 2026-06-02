import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import { Request } from "express";
import { supabase } from "../lib/supabase";

const BUCKET = process.env.SUPABASE_BUCKET ?? "uploads";

// ─── Multer: memória (sem escrever nada em disco) ─────────────────────────────
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Apenas imagens são permitidas"));
  }
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

// ─── Helper: faz upload para Supabase Storage e devolve URL pública ───────────
export async function uploadToSupabase(
  req: Request & { file?: Express.Multer.File },
): Promise<string | null> {
  if (!req.file) return null;

  const ext = path.extname(req.file.originalname).toLowerCase() || ".jpg";
  const filename = `${randomUUID()}${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false,
    });

  if (error) throw new Error(`Supabase upload falhou: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}