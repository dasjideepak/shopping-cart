let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let itemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    quantity:{type:Number,default:1}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);