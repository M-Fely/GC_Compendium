import { readFile } from "node:fs/promises";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export async function pdfExtract(extract) {
  const files = await readFile(extract);

  console.log(pdf);
  const extractedFiles = await pdf(files);
  return extractedFiles.text;
}

export default pdfExtract;
