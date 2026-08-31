const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(
  __dirname,
  "..",
  "uploads",
  "resumes"
);

// Folder automatically create hoga
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },

  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);

    const originalName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9_-]/g, "_");

    const fileName = `${Date.now()}-${originalName}${extension}`;

    cb(null, fileName);
  },
});

const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const allowedExtensions = [
  ".pdf",
  ".doc",
  ".docx",
];

const fileFilter = (_req, file, cb) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  const mimeAllowed = allowedMimeTypes.includes(
    file.mimetype
  );

  const extensionAllowed =
    allowedExtensions.includes(extension);

  if (mimeAllowed && extensionAllowed) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, DOC and DOCX resume files are allowed."
      )
    );
  }
};

const uploadResume = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = uploadResume;