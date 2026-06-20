import multer from "multer";
import { randomUUID } from "crypto";
import { Request } from "express";
import { supabase } from "../lib/supabase";

const BUCKET = process.env.SUPABASE_BUCKET ?? "uploads";
const ALLOWED_IMAGES: Record<
  string,
  { ext: string; matches: (buffer: Buffer) => boolean }
> = {
  "image/jpeg": {
    ext: ".jpg",
    matches: (buffer) =>
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff,
  },
  "image/png": {
    ext: ".png",
    matches: (buffer) =>
      buffer.length >= 8 &&
      buffer
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
  },
  "image/webp": {
    ext: ".webp",
    matches: (buffer) =>
      buffer.length >= 12 &&
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP",
  },
};

// ─── Multer: memória (sem escrever nada em disco) ─────────────────────────────
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (ALLOWED_IMAGES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error("Apenas imagens são permitidas"));
  }
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 20 },
});

// ─── Helper: faz upload para Supabase Storage e devolve URL pública ───────────
export async function uploadToSupabase(
  req: Request & { file?: Express.Multer.File },
): Promise<string | null> {
  if (!req.file) return null;

  const imageType = ALLOWED_IMAGES[req.file.mimetype];
  if (!imageType || !imageType.matches(req.file.buffer)) {
    throw new Error("Conteudo da imagem invalido");
  }

  const ext = imageType.ext;
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
