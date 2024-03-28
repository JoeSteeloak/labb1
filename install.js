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
connection.query(`CREATE TABLE courses (
    id                   integer auto_increment primary key,
    coursecode           varchar(255),
    coursename           varchar(255),
    syllabus             VARCHAR(255),
    progression          VARCHAR(1)
);`, (err, results) => {
    if(err) throw err;

    console.log("table created: " + results);
});

