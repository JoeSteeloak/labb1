// .env
require('dotenv').config({path: './.env'});

const mysql = require("mysql");

// Anslutningsinställningar
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER_ACC,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

connection.connect((err) => {
    if(err) {
        console.error("connection failed: " + err);
        return;
    }

    console.log("Connected to MySQL!");
})

// SQL-fråga
connection.query("CREATE TABLE id;", (err, results) => {
    if(err) throw err;

    console.log("Database created: " + results);
});

