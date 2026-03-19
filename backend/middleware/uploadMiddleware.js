const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    const extension = file.originalname.split(".").pop();

    return {
      folder: process.env.CLOUDINARY_FOLDER || "school-management-system",
      resource_type: "auto",
      public_id: `${Date.now()}-${file.originalname
        .replace(/\.[^/.]+$/, "")
        .replace(/\s+/g, "-")}`,
      format: extension,
    };
  },
});

const upload = multer({ storage });

module.exports = { uploadSingleFile: upload.single("file") };
