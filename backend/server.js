const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { put } = require("@vercel/blob");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: function (req, file, cb) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only JPG, PNG, and WEBP images are allowed.")
      );
    }

    cb(null, true);
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "File upload API is running."
  });
});

app.post("/api/upload", (req, res) => {
  upload.single("file")(req, res, async function (error) {

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

    try {

      const blob = await put(
        `uploads/${Date.now()}-${req.file.originalname}`,
        req.file.buffer,
        {
          access: "public",
          contentType: req.file.mimetype
        }
      );

      res.status(201).json({
        message: "File uploaded successfully.",

        file: {
          originalName: req.file.originalname,
          filename: blob.pathname,
          size: req.file.size,
          type: req.file.mimetype,
          url: blob.url
        }
      });

    } catch (error) {

      console.error("Blob upload error:", error);

      res.status(500).json({
        message: "Failed to upload file."
      });
    }

  });
});

module.exports = app;