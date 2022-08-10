const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  products: [
    {
      product: { type: Object, required: true },
      Quantity: { type: Number, require: true },
    },
  ],
  user: {
    name: {
      type: String,
      require: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      require: true,
    },
  },
});

module.exports = mongoose.model("Order", OrderSchema);
