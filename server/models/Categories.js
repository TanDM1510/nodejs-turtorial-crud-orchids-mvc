const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add the category name "],
    },
    description: {
      type: String,
      required: [true, "Please add the category description "],
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Categories", categorySchema);
