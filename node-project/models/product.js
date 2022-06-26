// imports
const fs = require('fs');
const path = require('path');

// declarations
const products = [];

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        const p = path.join(
                path.dirname(process.mainModule.filename),
                'data',
                'products.json'
            );
        fs.readFile(p, (err, fileContent) => {
            console.log(fileContent);
            console.log(err);
            let products = [];

            if(!err) {
                products = JSON.parse(fileContent);
            }
            products.push(this)
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log("error in writing new product : ", err)
            });
            
        });
    }

    static fetchAll() {
        return products;
    }
}