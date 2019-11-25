const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    author: { type: String, required: true },
    authorId: { type: String, required: true },
    content: { type: String },
    topic: { type: String, required: true },
    imageFile: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
