let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    items:[{
      type: Schema.Types.ObjectId,
      ref: "Item",
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);