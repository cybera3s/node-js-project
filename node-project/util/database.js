const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'ario',
    database: 'node_complete',
    password: 'S@j_06029842',
});


module.exports = pool.promise();