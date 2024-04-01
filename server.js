
const express = require("express");
const bodyParser = require("body-parser")   /* möjlighet att läsa in formdata */
const app = express();
const port = 9001;

let courseList = [];

app.set("view engine", "ejs");              //view engine: EJS
app.use(express.static("public"));          //statiska filer i katalog "public"
app.use(bodyParser.urlencoded({ extended: true }));

/* Routing */
app.get('/', (req, res) => {

    // Utför en fråga för att hämta data från databasen
    connection.query('SELECT * FROM courses', (err, rows) => {
        if (err) throw err;
        courseList = []; //radera listan så den inte upprepas

        rows.forEach(row => {
            // Skapa ett objekt för varje rad 
            const courseObject = {
                id: row.id,
                coursecode: row.coursecode,
                coursename: row.coursename,
                progression: row.progression,
                syllabus: row.syllabus
            };

            // Lägg till det nya objektet i courseList
            courseList.push(courseObject);
        });
        res.render("index", {
            courseList
        });
    });

});

app.get("/addcourse", (req, res) => {
    res.render("addcourse", {
        errors: [],
        newCode: "",
        newName: "",
        newSyllabus: "",
    });
})

app.post("/addcourse", (req, res) => {
    //läs in formulärdata
    let newCode = req.body.code;
    let newName = req.body.name;
    let newProgression = req.body.progression;
    let newSyllabus = req.body.syllabus;
    let errors = [];

    /* validera input */
    if (newCode === "") {
        errors.push("Ange en korrekt kurskod");
    }

    if (newName === "") {
        errors.push("Ange ett korrekt kursnamn");
    }

    if (newSyllabus === "") {
        errors.push("Ange en korrekt URL");
    }

    /* Är allt korrekt ifyllt? */
    if (errors.length === 0) {
        /* Skiv in i databasen */
        connection.query('INSERT INTO courses(coursecode, coursename, progression, syllabus) VALUES (?, ?, ?, ?)',
            [newCode, newName, newProgression, newSyllabus],
            (err, results) => {
                if (err) throw err;
                console.log("Data inserted successfully: ", results);
            });
        /* Nollställ värden */
        newName = "";
        newEmail = "";

        //Redirect till startsidan
        res.redirect("/");

    } else {
        res.render("addcourse", {
            errors: errors,
            newCode: newCode,
            newName: newName,
            newProgression: newProgression
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
require('dotenv').config({ path: './.env' });

const mysql = require("mysql");

// Anslutningsinställningar
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER_ACC,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

connection.connect((err) => {
    if (err) {
        console.error("connection failed: " + err);
        return;
    }

    console.log("Connected to MySQL!");
})


/* Hämta in databasen */

// Utför en fråga för att hämta data från databasen
/* connection.query('SELECT * FROM courses', (err, rows) => {
    if (err) throw err;

    rows.forEach(row => {
        // Skapa ett objekt för varje rad 
        const courseObject = {
            id: row.id,
            coursecode: row.coursecode,
            coursename: row.coursename,
            progression: row.progression,
            syllabus: row.syllabus
        };

        // Lägg till det nya objektet i dataList
        courseList.push(courseObject);
    });

});
 */

/* Radera en rad i databasen */

app.post("/deleteCourse", (req, res) => {
    // Läs in id för kursen som ska tas bort
    const courseId = req.body.courseId;

    // query för att ta bort kursen från databasen 
    connection.query('DELETE FROM courses WHERE id = ?', [courseId], (err, results) => {
        if (err) {
            console.error("Error deleting course: ", err);
            res.status(500).send("Error deleting course");
            return;
        }

        console.log("Course deleted successfully: ", results);

        // Uppdatera courseList 
        const updatedCourseList = courseList.filter(course => course.id !== courseId);
        courseList = updatedCourseList;

        //Redirect till startsidan
        res.redirect("/");

    });
});