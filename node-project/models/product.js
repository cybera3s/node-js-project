// imports

const Cart = require('./cart');

// declarations




module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        
       
    }

    static deleteById(id) {

       

    }

    static fetchAll(callback) {
        
    }

    static findById(id, callback) {
       
    }
}