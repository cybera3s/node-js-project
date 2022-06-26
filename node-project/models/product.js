// imports
const fs = require('fs');
const path = require('path');

// declarations
const products = [];
const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const getProductsFromFile = callback => {
    
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            return callback([]);
        } else {
            callback(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this)
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log("error in writing new product : ", err)
            });
        });
    }

    static fetchAll(callback) {
        getProductsFromFile(callback)
    }
}