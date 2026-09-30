import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import ApiError from "../utils/ApiError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.pdf`);
  },
});

const ALLOWED_MIMETYPE = "application/pdf";
const ALLOWED_EXTENSION = ".pdf";

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname || "").toLowerCase();

  if (file.mimetype !== ALLOWED_MIMETYPE || extension !== ALLOWED_EXTENSION) {
    return cb(
      new ApiError(400, "Only PDF files are allowed"),
      false
    );
  }

  cb(null, true);
};

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
});