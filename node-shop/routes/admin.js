const path = require("path");

const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");


const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/add-product => POST
router.post("/add-product",
 isAuth,
[
    body('title', "Title must only contain letters and numbers with maximum length of 150 characters.")
    .isAlphanumeric(['en-US'], {'ignore': ' '})    
    .isLength({ min: 2, max: 150 })
    .trim(),
    body('price', "Price must be Integer or Decimal and greater than 0")
    .isFloat({ gt: 0 }),
    body('description', "Description must only contain letters and numbers")
    .isAlphanumeric(['en-US'], {'ignore': ' '})    
    .isLength({ min: 10, max: 400 })
    .trim()
], 
adminController.postAddProduct);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post("/edit-product", isAuth, 
[
    body('title', "Title must only contain letters and numbers with maximum length of 150 characters.")
    .isAlphanumeric(['en-US'], {'ignore': ' '})
    .isLength({ min: 2, max: 150 })
    .trim(),
    body('price', "Price must be Integer or Decimal and greater than 0")
    .isFloat({ gt: 0 }),
    body('description', "Description must only contain letters and numbers")
    .isAlphanumeric(['en-US'], {'ignore': ' '})
    .isLength({ min: 10, max: 400 })
    .trim()
], 
adminController.postEditProduct);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
