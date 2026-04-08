import multer from "multer";
import path from "path";
import fs from "fs";

const dir = "uploads/avatars";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, dir),
  filename:    (_req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const name = `avatar-${Date.now()}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only jpeg, png, webp images allowed"));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
});