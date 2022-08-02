const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const OrderItem = sequelize.define("orderItem", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: Sequelize.INTEGER,

});

module.exports = OrderItem;