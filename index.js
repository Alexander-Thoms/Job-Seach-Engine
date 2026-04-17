const port = 8080
const express = require("express");
const app = express();
const mysql = require("mysql2");
const path = require('path');
const expresshandlebars = require(`express-handlebars`);
const engine = expresshandlebars.engine;
const dotenv = require('dotenv');
const helmet = require('helmet');
app.use(helmet());
dotenv.config();
const sqlpass = process.env.sqlpassword;
const api = process.env.API_KEY;
const url = `https://jsearch.p.rapidapi.com/search?query=`;
let resultarray = [];
app.engine(`hbs`, engine({ extname: `.hbs` }));
app.set(`view engine`, `hbs`);
app.set(`views`, `./views`);
app.use(express.static(path.join(__dirname, `public`)));
const ratelimit = require('express-rate-limit');

const limit = ratelimit({
    windowMs: 1 * 60 * 1000, // one min
    max: 10,
    message: "too many requests from this IP!"
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: sqlpass,
    database: 'final',
    multipleStatements: true

});

connection.connect((err) => {
    if (err) {
        console.error("error connecting to myql: " + err.stack)
    }
    console.log("connected to sql");

});


function makelinks(namesparam) {
    let content = ""
    let breaks = "<br>";
    let articlestart = "<article>";
    let articleend = "</article>";
    for (let index = 0; index < namesparam.length; index++) { // for loop each items in names array
        let end = "</a>";
        content += articlestart + `<a href=${namesparam[index]}>` + namesparam[index] + end + articleend + breaks // create proper li html code
    }
    return content

}

// CREATE SCHEMA `final` ;
// create table jobs( links TEXT NOT NULL);

app.post(`/remove`, limit, async (req, res) => {

    let removecode = `drop table jobs; create table jobs( links TEXT NOT NULL);`;
    connection.query(removecode, (error, results, field) => {
        if (error) {
            console.warn(error)
        }

    });
    console.log("clear success");
    res.redirect(`/saved`)
});


app.get("/", limit, (req, res) => {
    res.render(`home`, { layout: `home`, searchlink: '/search', savedlink: `/saved` });
});



app.get(`/search`, limit, async (req, res) => {
    if (res.response == 400) {
        res.redirect("/");
    }
    let usersearch = req.query.search || "";// improper type validation
    if (!usersearch) {
        console.log(`no input`);
        usersearch = "";

    }
    if (usersearch.includes('http') || usersearch.includes('https') || usersearch.includes("/")) {
    return res.status(400).send("no!");
}
    if (typeof (usersearch) !== "string") {
        return res.status.status('400').send("enter a string");
    }
    let end = `&page=1&num_pages=1&country=ca&date_posted=all`;
    let customurl = `${url}${encodeURIComponent(usersearch)}${end}`;
    if (typeof (customurl) !== "string") {
        return res.status(400).send("stop")
    }
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': api,
            'x-rapidapi-host': 'jsearch.p.rapidapi.com',
            'Content-Type': 'application/json'
        }
    };

    

    const response = await fetch(customurl, options); //SSRF
    const result = await response.json();
    
    let data = result.data || [];
    for (let index = 0; index < data.length; index++) {
        resultarray.push(data[index].job_apply_link);
    }
    let links = makelinks(resultarray);

    console.log(result);
    console.log(usersearch);
    res.render(`search`, { layout: `search`, query: url, api: api, query: url + usersearch, links: links })
});

app.get(`/saved`, async (req, res) => {
    let selectalljobs = "SELECT links FROM jobs";
    let sqllinks = [];
    connection.query(selectalljobs, (error, results, field) => {
        if (error) {
            console.warn(error);
        }
        results.forEach((record) => {
            sqllinks.push(record.links);
        });
        let sqljobs = makelinks(sqllinks);
        res.render(`saved`, { layout: `saved`, links: sqljobs });
    });

});
app.post(`/save`, async (req, res) => {
    for (let index = 0; index < resultarray.length; index++) {
        let output = resultarray[index]
        let insertcode = `insert into jobs(links) values (?)`;
        connection.query(insertcode, [output], (error, results, field) => {
            if (error) {
                console.warn(error);
            }
            console.log(results);
            console.log("save success");

        });
    }
    res.redirect(`/saved`);
});
app.listen(port, () => console.log(`port is running on: `, port));

