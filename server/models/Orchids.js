const mongoose = require("mongoose");

const Schema = mongoose.Schema;

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
    comments: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
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
module.exports = mongoose.model("Orchids", OrchidSchema);
