const path = require('path');

const express = require('express');

const rootdir = require('../util/path')
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
    // console.log("shopjs: ", adminData.products)
    // res.sendFile(path.join(rootdir, 'views', 'shop.html'));
    const products = adminData.products;
    res.render('shop', {prods: products, pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
})
});

module.exports = router;