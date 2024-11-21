const mysql = require('mysql2');

// Buat koneksi pool ke database MySQL
const pool = mysql.createPool({
  host: 'localhost',           
  user: 'root',                
  password: '',                
  database: 'zooDB',           
});


const promisePool = pool.promise();

module.exports = promisePool;
