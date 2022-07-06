const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'node_complete',
    'root',
    'S@j_06029842',
    {
    dialect: 'mysql',
    host: 'localhost'
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