import multer from "multer";
import express from "express";
import path from "path";
import pdfExtract from "../services/pdfService.js";
import { transformToVector } from "../services/embeddingService.js";
import { verifyUser, verifyAdmin } from "../middleware/authMiddleware.js";
import { Document } from "../models/documents.js";
import { UploadedFile } from "../models/uploadedFile.js";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), "uploads");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }

    cb(null, true);
  },
});

router.get("/test", (req, res) => {
  console.log("Im working");
  res.send("OK");
});

router.get("/files", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const files = await UploadedFile.find().sort({ uploadedAt: -1 });

    res.json(files);
  } catch (error) {
    res.status(500).json({
      message: "Cannot GET Files",
    });
  }
});

const createChunks = (text, chunkSize = 500, overlap = 100) => {
  const chunks = [];

  let start = 0;

  while (start < text.length) {
    const end = start + chunkSize;

    chunks.push(text.slice(start, end).trim());

    start += chunkSize - overlap;
  }

  return chunks.filter((chunk) => chunk.length > 50);
};

router.post(
  "/file",
  verifyUser,
  verifyAdmin,
  upload.single("docs"),
  async function (req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      console.log("FILE OBJECT:", req.file);

      const normalizedName = req.file.originalname.trim().toLowerCase();

      const existingFile = await UploadedFile.findOne({
        fileName: normalizedName,
      });

      if (existingFile) {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(400).json({
          message: "This PDF already exists.",
        });
      }

      const uploadedFile = await UploadedFile.create({
        fileName: normalizedName,
        path: req.file.path,
      });

      const rawExtract = await pdfExtract(req.file.path);

      const cleanedText = rawExtract
        .replace(/\r/g, "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      const lines = cleanedText.split("\n");

      const storedRawText = [];

      let section = {
        fileName: normalizedName,
        title: "General",
        content: "",
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line === "") continue;

        const headerLine =
          line.length > 3 &&
          line.length < 80 &&
          /^[A-Z0-9\s\-()]+$/.test(line) &&
          line === line.toUpperCase() &&
          line.split(" ").length <= 8 &&
          !/^\d+$/.test(line);

        if (headerLine) {
          if (section.content.trim() !== "") {
            storedRawText.push(section);
          }

          const cleanTitle = line
            .replace(/^[●•\-]\s*/, "")
            .replace(/\s+/g, " ")
            .trim();

          section = {
            fileName: normalizedName,
            title: cleanTitle,
            content: "",
          };
        } else {
          section.content += (section.content ? "\n" : "") + line;
        }
      }

      if (section.content.trim() !== "") {
        storedRawText.push(section);
      }

      const temporaryDB = [];

      for (const section of storedRawText) {
        const chunks = createChunks(section.content);

        for (const chunk of chunks) {
          temporaryDB.push({
            fileName: section.fileName,
            section: section.title,
            text: chunk,
          });
        }
      }
      console.log("temporaryDB: ", temporaryDB);

      const documentsToInsert = [];

      for (const item of temporaryDB) {
        const embeddingInput = `
              File: ${item.fileName}
              Section: ${item.section}

              ${item.text}
              `;

        const embeddingResult = await transformToVector(embeddingInput);

        if (!embeddingResult) continue;

        documentsToInsert.push({
          fileName: item.fileName,
          section: item.section,
          text: item.text,
          embedding: embeddingResult,
          fileId: uploadedFile._id,
        });
      }
      console.log("documentsToInsert: ", documentsToInsert);
      if (documentsToInsert.length > 0) {
        await Document.insertMany(documentsToInsert);
      }

      return res.json({
        message: "success",
        chunksStored: documentsToInsert.length,
        file: uploadedFile,
      });
    } catch (error) {
      console.log("UPLOAD ERROR:", error);

      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        message: error.message,
      });
    }
  },
);

router.delete("/file/:id", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const file = await UploadedFile.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    await Document.deleteMany({
      fileId: file._id,
    });

    await UploadedFile.findByIdAndDelete(file._id);

    res.json({
      message: "File deleted successfully",
    });
  } catch (error) {
    console.log("Cannot DELETE:", error);

    res.status(500).json({
      message: "Failed to delete file",
    });
  }
});

export default router;

/* import multer from "multer";
import express from "express";
import path from "path";
import pdfExtract from "../services/pdfService.js";
import { transformToVector } from "../services/embeddingService.js"; */
/* import { globalArray } from "../services/vectorStore.js"; */
/* import { verifyUser, verifyAdmin } from "../middleware/authMiddleware.js";
import { Document } from "../models/documents.js";
import { UploadedFile } from "../models/uploadedFile.js";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), "uploads");
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/test", (req, res) => {
  console.log("Im working");
  res.send("OK");
});

router.get("/files", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const files = await UploadedFile.find().sort({ uploadedAt: -1 });
    res.json(files);
  } catch (error) {
    res.status(500).json({
      message: "Cannot GET Files",
    });
  }
});

router.post(
  "/file",
  verifyUser,
  verifyAdmin,
  upload.single("docs"),
  async function (req, res) {
    try { */
/* globalArray.length = 0; */
/* 
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      console.log("FILE OBJECT: ", req.file);

      const existingFile = await UploadedFile.findOne({
        fileName: req.file.originalname,
      });

      if (existingFile) {
        return res.status(400).json({
          message: "This PDF already exists.",
        });
      }

      const uploadedFile = await UploadedFile.create({
        fileName: req.file.originalname,
        path: req.file.path,
      });

      const rawExtract = await pdfExtract(req.file.path);
      const lines = rawExtract.split("\n");

      const storedRawText = [];
      let section = {
        fileName: req.file.originalname,
        title: "General",
        content: "",
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === "") continue;

        const headerLine =
          line.length < 60 &&
          /^[A-Z0-9\s\-()]+$/.test(line) &&
          line === line.toUpperCase() &&
          line.split(" ").length <= 6;

        if (headerLine) {
          if (section.content.trim() !== "") {
            storedRawText.push(section);
          }
          const filename = req.file.originalname;
          const cleanTitle = line
            .replace(/^[●•\-]\s*/ /* , "")
            .replace(/\s+/g, " ")
            .trim();
          section = {
            fileName: filename,
            title: cleanTitle,
            content: "",
          };
        } else {
          if (section && section.content !== undefined) { */
/* section.content += (section.content ? " " : "") + line; */
/*      section.content += (section.content ? "\n" : "") + line;
          }
        }
      }
      if (section.content.trim() !== "") {
        storedRawText.push(section);
      } */

/* const sentenceChunk = (text) =>
        text
          .split(/[.!?]+/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0); */

/* const sentenceChunk = (text) => {
        return text
          .split(/\n+/)
          .map((line) => line.trim())
          .filter((line) => line.length > 0);
      };

      const temporaryDB = [];

      for (let i = 0; i < storedRawText.length; i++) {
        const section = storedRawText[i];

        const sentences = sentenceChunk(section.content);

        let buffer = [];

        for (let j = 0; j < sentences.length; j++) {
          buffer.push(sentences[j]);

          if (buffer.length >= 5 || j === sentences.length - 1) {
            temporaryDB.push({
              fileName: section.fileName,
              section: section.title,
              text: buffer.join(". "),
            });

            buffer = [];
          }
        }
      }
      console.log(temporaryDB);
      const embeddingDB = [];

      for (const text of temporaryDB) {
        const embeddingResult = await transformToVector(text.text);

        if (embeddingResult == null) {
          continue;
        }
        embeddingDB.push({
          fileName: text.fileName,
          section: text.section,
          text: text.text,
          embedding: embeddingResult,
        });

        const exists = await Document.findOne({
          fileName: text.fileName,
          text: text.text,
        });

        if (!exists) {
          await Document.create({
            fileName: text.fileName,
            section: text.section,
            text: text.text,
            embedding: embeddingResult,
            fileId: uploadedFile._id,
          });
        }
      } */

/* console.log("global array", globalArray[0]); */
/* return res.json({
        message: "success",
        sections: embeddingDB,
      });
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        message: error.message,
      });
    }
  },
);

router.delete("/file/:id", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const file = await UploadedFile.findById(req.params.id);
    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    await Document.deleteMany({
      fileId: file._id,
    });

    await UploadedFile.findByIdAndDelete(file._id);

    res.json({
      message: "File deleted successfully",
    });
  } catch (error) {
    console.log("Cannot DELETE:", error);
    res.status(500).json({
      message: "Failed to delete file",
    });
  }
});

export default router;
 */
