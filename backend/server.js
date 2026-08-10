const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const uploadDirectory = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },

  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);

    const filename =
      `${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;

    cb(null, filename);
  }
});

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp"
];

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: function (req, file, cb) {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only JPG, PNG, and WEBP images are allowed.")
      );
    }

    cb(null, true);
  }
});

app.use("/uploads", express.static(uploadDirectory));

app.get("/", (req, res) => {
  res.json({
    message: "File upload API is running."
  });
});

app.post("/api/upload", (req, res) => {
  upload.single("file")(req, res, function (error) {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "File size must be 5 MB or less."
        });
      }

      return res.status(400).json({
        message: error.message
      });
    }

    if (error) {
      return res.status(400).json({
        message: error.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image to upload."
      });
    }

    const fileUrl =
      `http://localhost:${PORT}/uploads/${req.file.filename}`;

    res.status(201).json({
      message: "File uploaded successfully.",
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        type: req.file.mimetype,
        url: fileUrl
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});