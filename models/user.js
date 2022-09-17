const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          require: true,
          ref: "Product",
        },
        quantity: { type: Number, require: true },
      },
    ],
  },
});


userSchema.methods.addToCart = 
/**
    add provided product object to cart items 
    if product exists in cart items add up it's quantity
    else add new product to cart items 
    finally save the cart

    @param product product object
*/
function (product) {
  
  // get index of product in cart items otherwise -1
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  // product already exists in cart items then adds up it's quantity with 1
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  // product is new
  } else {  
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function(){
  this.cart = {items: []}
  return this.save();
}

module.exports = mongoose.model("User", userSchema);
