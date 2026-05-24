import mongoose from "mongoose";

const uploadedFileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export const UploadedFile = mongoose.model("UploadedFile", uploadedFileSchema);
