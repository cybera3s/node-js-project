const { validationResult } = require("express-validator");

const fileHelper = require("../util/file");
const Product = require("../models/product");
const catchError = require("../util/catchError");

/**
  Handles GET request to reach out add product page
*/
exports.getAddProduct = (req, res, next) => {

  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    errorMessage: "",
    oldInput: {
      title: "",
      price: "",
      description: "",
    },
    validationErrors: [],
  });
};

/**
  Handles POST request to add a new product
*/
exports.postAddProduct = async (req, res, next) => {

  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  const errors = validationResult(req);

  // check if image file exists in request
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      errorMessage: "Attached file is not an image!",
      oldInput: {
        title: title,
        price: price,
        description: description,
      },
      validationErrors: errors.array(),
    });
  }
  // user input validations
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      errorMessage: "Please correct Below Errors!.",
      oldInput: {
        title: title,
        price: price,
        description: description,
      },
      validationErrors: errors.array(),
    });
  }

  const imageUrl = image.path;

  const product = new Product({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId: req.user,
  });

  try {
    await product.save();
    console.log("Product Created!");
    res.redirect("/admin/products");
  } catch (err) {
    catchError(err, next);
  }
};

/**
  Handles GET request to reach out edit product page
*/
exports.getEditProduct = async (req, res, next) => {
  

  const editMode = req.query.edit; // admin/edit-product?edit=true
  if (!editMode) {
    return res.redirect("/");
  };

  const prodId = req.params.productId;
  const product = await Product.findById(prodId);

  try {
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
      errorMessage: "",
      oldInput: {
        title: "",
        price: "",
        description: "",
      },
      validationErrors: [],
    });

  } catch (err) {
    catchError(err, next);
  };

};

/**
  Handles POST request to edit a Product
*/
exports.postEditProduct = async (req, res, next) => {

  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const image = req.file;

  const errors = validationResult(req);

  // user input validations
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      errorMessage: "Please correct Below Errors!.",
      product: {
        _id: prodId,
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDescription,
      },
      validationErrors: errors.array(),
    });
  }

  try {
    
    const product = await Product.findById(prodId);

    // check ownership of product for user
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect("/");
    };

    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDescription;

    // remove image and update imageUrl of product if new image uploaded
    if (image) {
      fileHelper.deleteFile(product.imageUrl);
      product.imageUrl = image.path;
    };

    await product.save();
    res.redirect("/admin/products");
    
  } catch (err) {
      catchError(err, next);
  };

};


/**
    Handles DELETE request to remove a product
*/
exports.deleteProduct = async (req, res, next) => {
  
  const prodId = req.params.productId;

  try {

    const product = await Product.findById(prodId);
    // check product existence
    if (!product) {
      return next(new Error("Product not found"));
    };
    // remove product image file
    fileHelper.deleteFile(product.imageUrl);
    await Product.deleteOne({ _id: prodId, userId: req.user._id });

    console.log("Destroyed product");
    res.status(200).json({ message: "Product Deleted" });

  } catch (err) {
    res.status(500).json({ message: "Deleting Product Failed." });
  };

};

/*
    Handles GET request to reach out products list of current active user 
*/
exports.getProducts = async (req, res, next) => {

  try {
    // fetch current active user products
    const products = await Product.find({ userId: req.user._id });
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
      hasProducts: products.length > 0,
      activeShop: true,
    });

  } catch (err) {
      catchError(err, next);
  };

};
