
const express = require("express");
const bodyParser = require("body-parser")   /* möjlighet att läsa in formdata */
const app = express();
const port = 9001;

const memberList = [
    {
        fullname: "Jonas Ståleker",
        email: "jonasstaleker@gmail.com"
    },
    {
        fullname: "Mattias Dahlgren",
        email: "mattias.dahlgren@miun.se"
    },
    {
        fullname: "Malin Larsson",
        email: "malin.larsson@miun.se"
    },
];

app.set("view engine", "ejs");              //view engine: EJS
app.use(express.static("public"));          //statiska filer i katalog "public"
app.use(bodyParser.urlencoded({ extended: true }));

/* Routing */
app.get('/', (req, res) => {
    res.render("index", {
        fullName: "Jonas Ståleker"
    });
});

app.get('/members', (req, res) => {

    res.render("members", {
        memberList
    });
});

app.get("/members/add", (req, res) => {
    res.render("addmember", {
        errors: [],
        newName: "",
        newEmail: ""
    });
})

app.post("/members/add", (req, res) => {
    //läs in formulärdata
    let newName = req.body.name;
    let newEmail = req.body.email;

    let errors = [];

    /* validera input */
    if (newName === "") {
        errors.push("Ange ett korrekt namn");
    }

    if (newEmail === "") {
        errors.push("Ange en korrekt Epost-adress");
    }

    /* Är allt korrekt ifyllt? */
    if (errors.length === 0) {
        memberList.push({
            fullname: newName,
            email: newEmail
        });
        /* Nollställ värden */
        newName = "";
        newEmail = "";

        //Redirect till medlemssidan
        res.redirect("/members");
    } else {
        res.render("addmember", {
            errors: errors,
            newName: newName,
            newEmail: newEmail
        });
    }
});

app.get('/about', (req, res) => {
    res.render("about");
});


/* Starta */
app.listen(port, () => {
    console.log("server started on port " + port);
});


/* Starta upp databasen */
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