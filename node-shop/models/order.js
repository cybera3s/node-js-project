const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, require: true },
    },
  ],
  user: {
    email: {
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
