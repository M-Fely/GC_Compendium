import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number],
    required: true,
  },
  source: {
    type: String,
  },
  uploadedBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Document = mongoose.model("Documents", documentSchema);
