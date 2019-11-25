const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const privateMessageSchema = new Schema(
  {
    author: { type: String, required: true },
    authorId: { type: String, required: true },
    content: { type: String },
    receiver: { type: String, required: true },
    imageFile: { type: String },
    participants: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model('PrivateMessage', privateMessageSchema);
