let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    quantity: { type: Number, deafult: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
