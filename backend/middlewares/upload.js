import multer from "multer";
import path from "path";
import fs from "fs";

const getUploadPath = (req) => {
  if (req.originalUrl.includes("user")) return "uploads/user";
  if (req.originalUrl.includes("worker")) return "uploads/worker";
  if (req.originalUrl.includes("dealer")) return "uploads/dealer";
  if (req.originalUrl.includes("waste")) return "uploads/waste";
  return "uploads/";
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = getUploadPath(req);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });
