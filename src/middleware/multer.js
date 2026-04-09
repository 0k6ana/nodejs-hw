import multer from "multer";
import createHttpError from "http-errors";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new createHttpError(400, "Only images allowed"));
    } else {
      cb(null, true);
    }
  },
});
