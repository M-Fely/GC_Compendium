import multer from "multer";
import express from "express";
import path from "path";
import pdfExtract from "../services/pdfService.js";
import { transformToVector } from "../services/embeddingService.js";
import { globalArray } from "../services/vectorStore.js";

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

router.post("/file", upload.single("docs"), async function (req, res) {
  try {
    if (req.file) {
      console.log("FILE OBJECT: ", req.file);
      const rawExtract = await pdfExtract(req.file.path);

      const paragraphChunk = (text) =>
        text
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter((p) => p !== "");
      const chunk = paragraphChunk(rawExtract);

      const sentenceChunk = (paragraph) =>
        paragraph.split(/[.!?]+/).filter((s) => s.trim().length > 0);

      const temporaryDB = [];

      for (let i = 0; i < chunk.length; i++) {
        const currentParagraph = chunk[i];
        const sentenceList = sentenceChunk(currentParagraph);

        if (sentenceList.length < 3) {
          const sentenceCount = sentenceList.length;
          const paragraphStart = 0;
          const preview = currentParagraph.substring(paragraphStart, 50);

          console.log(
            `Bad Chunk Alert! Too short! index ${i}, ${sentenceCount} sentence, ${preview}`,
          );

          let buffer = [...sentenceList];
          let nextIndex = i + 1;
          while (buffer.length < 3 && nextIndex < chunk.length) {
            const nextSentence = sentenceChunk(chunk[nextIndex]);
            buffer = buffer.concat(nextSentence);

            i = nextIndex - 1;
            nextIndex++;

            if (buffer.length >= 3 && buffer.length <= 8) {
              break;
            }
          }
          temporaryDB.push(buffer.join(" "));
        } else if (sentenceList.length > 8) {
          const sentenceCount = sentenceList.length;
          const paragraphStart = 0;
          const preview = currentParagraph.substring(paragraphStart, 50);

          console.log(
            `Bad Chunk Alert! Too long! index ${i}, ${sentenceCount} sentences, ${preview}`,
          );
          for (let j = 0; j < sentenceList.length; j += 8) {
            const sliceChunk = sentenceList.slice(j, j + 8);

            temporaryDB.push(sliceChunk.join(" "));
          }
        } else {
          temporaryDB.push(sentenceList.join(" "));
        }
      }
      console.log("Temporary DB: ", temporaryDB);
      const embeddingDB = [];

      for (const text of temporaryDB) {
        const embeddingResult = await transformToVector(text);

        if (embeddingResult == null) {
          continue;
        }
        embeddingDB.push({ text: text, embedding: embeddingResult });
        globalArray.push({ text: text, embedding: embeddingResult });
      }

      res.json({ embeddingDB });
    } else {
      res.status(400).send("No file uploaded");
    }
  } catch (error) {
    res
      .status(500)
      .send(
        "The request could not be processed due to validation errors. " +
          error.message,
      );
  }
});

export default router;
