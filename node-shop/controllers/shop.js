const fs = require("fs");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const pdfDocument = require("pdfkit");

const Product = require("../models/product");
const Order = require("../models/order");

const ITEMS_PER_PAGE = process.env.ITEMS_PER_PAGE || 10;

const catchError = require("../util/catchError");

/**
  Returns Extracted page number from request query parameters
  then returns along with fetched products count and paginated products
  
  @param req request object
  @param itemsPerPage Number of products per page
*/
const getAndPaginateProducts = async (req, itemsPerPage) => {
  const page = +req.query.page || 1;
  try {
    const numProducts = await Product.find().countDocuments();
    const products = await Product.find()
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

    return {
      numProducts: numProducts,
      products: products,
      page: page,
    };
  } catch (err) {
    throw new Error(err);
  }
};

/**
    GET request to products page
*/
exports.getProducts = async (req, res, next) => {
  try {
    let { numProducts, products, page } = await getAndPaginateProducts(
      req,
      ITEMS_PER_PAGE
    );

    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < numProducts,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(numProducts / ITEMS_PER_PAGE),
    });
  } catch (err) {
    catchError(err, next);
  }
};

/**
    GET request to index page
*/
exports.getIndex = async (req, res, next) => {
  try {
    let { numProducts, products, page } = await getAndPaginateProducts(
      req,
      ITEMS_PER_PAGE
    );

    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < numProducts,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(numProducts / ITEMS_PER_PAGE),
    });
  } catch (err) {
    catchError(err, next);
  }
};

/**
    GET request to detail page of product 
    with product id extracted from request path parameters
*/
exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;

  try {
    const product = await Product.findById(prodId);
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  } catch (err) {
    catchError(err, next);
  }
};

/**
    GET request to cart page of current active user
*/
exports.getCart = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.productId");
    const products = user.cart.items;

    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: products,
    });
  } catch (err) {
    catchError(err, next);
  }
};

/**
    POST request that adds a product with provided id in request body
    to current active user cart
*/
exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    const product = await Product.findById(prodId);
    await req.user.addToCart(product);
    res.redirect("/cart");
  } catch (err) {
    catchError(err, next);
  }
};

/**
    Handles DELETE request that removes product with provided
    id in request path parameters from cirrent user cart items
*/
exports.CartDeleteProduct = async (req, res, next) => {
  const prodId = req.params.productId;

  try {
    await req.user.removeFromCart(prodId);
    res.status(200).json({ message: "Product Deleted successfully" });
  } catch (err) {
    catchError(err, next);
  }
};

/**
    Handles GET request to reach out checkout page
    then calculate total price of cart items and prepare
    Stripe session for payment
*/
exports.getCheckout = async (req, res, next) => {
  let total = 0;

  try {
    const user = await req.user.populate("cart.items.productId");
    let products = user.cart.items;

    // calculate total amount
    products.forEach((p) => {
      total += p.quantity + p.productId.price;
    });

    // prepare Stripe session with fetched data
    const session = await stripe.checkout.sessions.create({
      line_items: products.map((p) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: p.productId.title,
            },
            unit_amount: p.productId.price * 100,
          },
          quantity: p.quantity,
        };
      }),
      mode: "payment",
      success_url: req.protocol + "://" + req.get("host") + "/checkout/success",
      cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel",
    });

    res.render("shop/checkout", {
      path: "/checkout",
      pageTitle: "Checkout",
      products: products,
      totalSum: total,
      sessionId: session.id,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

/**
    Handles GET request to reach out checkout success page 
    then create Order object and clear the cart
*/
exports.getCheckoutSuccess = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.productId");

    // prepare products list for saving in order object
    const products = user.cart.items.map((i) => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });

    // create new Order object
    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user,
      },
      products: products,
    });

    await order.save();
    req.user.clearCart();
    res.redirect("/orders");
  } catch (err) {
    catchError(err, next);
  }
};

/**
    Handles GET request to reach out orders page
    of current active user
*/
exports.getOrders = async (req, res, next) => {
  try {
    // fetch orders of current user with related products
    const orders = Order.find({ "user._id": req.user._id }).populate(
      "products.product"
    );

    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your orders",
      orders: orders,
    });
  } catch (err) {
    errorCatch(err, next);
  }
};

/**
    Handles GET request to reach out invoice pdf file of orders
*/
exports.getInvoice = async (req, res, next) => {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return next(new Error("No Order Found."));
    }

    // check ownership of order
    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error("Unauthorized."));
    }
    // prepare invoice file path
    const invoiceName = "invoice-" + orderId + ".pdf";
    const invoicePath = path.join("data", "invoices", invoiceName);

    const pdfDoc = new pdfDocument();
    // set required headers for pdf
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="' + invoiceName + '"'
    );
    // write pdf content in file and also to response object
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    pdfDoc.fontSize(30).text("Invoice", {
      underline: true,
      align: "center",
    });

    let totalPrice = 0;

    order.products.forEach((prod) => {
      totalPrice += prod.quantity * prod.product.price;
      pdfDoc.image(prod.product.imageUrl, {
        width: 300,
        align: "center",
      });
      pdfDoc.moveDown();

      pdfDoc
        .fontSize(20)
        .text(
          prod.product.title +
            " - " +
            prod.quantity +
            " x " +
            "$" +
            prod.product.price
        );
    });
    pdfDoc.text("------------------------");

    pdfDoc.fontSize(25).text("Total Price: $" + totalPrice);
    pdfDoc.end();
  } catch (err) {
    catchError(err, next);
  }
};
