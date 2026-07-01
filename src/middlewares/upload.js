import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `usuario-${req.params.id}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const permitidos = ['image/jpeg', 'image/png', 'image/webp'];
  if (permitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato no permitido. Solo se aceptan imágenes JPG, PNG o WEBP.'));
  }
};

export const uploadFoto = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});
