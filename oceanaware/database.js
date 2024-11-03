const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'SIK', 
    password: '', 
    database: 'oceanaware'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database.');
});

module.exports = db;
