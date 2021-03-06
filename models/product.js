var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productSchema = new Schema(
  {
    name: { type: String },
    images: { type: String },
    price: { type: Number },
    description: { type: String },
    category: {type: String}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
