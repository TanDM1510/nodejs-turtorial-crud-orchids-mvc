const mongoose = require("mongoose");

const Schema = mongoose.Schema;
var commentSchema = new Schema(
  {
    rating: { type: Number, min: 1, max: 5, require: true },
    comment: { type: String, require: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      require: true,
    },
  },
  { timestamps: true }
);

const OrchidSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    original: {
      type: String,
      required: true,
    },
    isNatural: {
      type: Boolean,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    comments: [commentSchema],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
const Orchid = mongoose.model("Orchids", OrchidSchema);
module.exports = Orchid;
