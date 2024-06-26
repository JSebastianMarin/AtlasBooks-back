import multer from "multer";
import removeFileExt from "./src/utils/removeFileExt.js";

// Obtener __dirname en ES6
import { fileURLToPath } from "url";
import path from "path";

const CURRENT_DIRNAME = path.dirname(fileURLToPath(import.meta.url));

//Aux function to manage file uploading
export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${CURRENT_DIRNAME}/storage/books`);
  },
  filename: function (req, file, cb) {
    const ext = removeFileExt(file.originalname);
    const filename = `file-${Date.now()}.${ext}`;
    cb(null, filename);
  },
});
