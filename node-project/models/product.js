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
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        this.id = Math.random().toString();
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

    static findById(id, callback) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id == id);
            callback(product);
        });
    }
}