const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
    dialect: 'mysql',
    host: process.env.DB_HOST
    }
);

module.exports = sequelize;

// const mysql = require('mysql2');



// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'ario',
//     database: 'node_complete',
//     password: 'S@j_06029842',
// });


// module.exports = pool.promise();