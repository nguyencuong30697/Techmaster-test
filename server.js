// Modules
// const http = require('http');
// const fs = require('fs');
// const path = require('path');
const mysql = require('mysql');
const shell = require('shelljs');
const express = require('express');
require('dotenv').config()

const app = express();
app.use(express.static('client'));

// Server configuration
const port = process.env.HTTP_PORT;

var connection = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.DATABASE
});

connection.connect(function (err) {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
    var sql = "SELECT * FROM Persons";
    connection.query(sql, function (err, results) {
        if (err) throw err;
        console.log(results);
        const nameAuthor = `${results[0].LastName} ${results[0].FirstName}`;

        shell.exec(`echo "<div class="name-author">Name: <div class="txtAuthor">${nameAuthor}</div> (Get from RDS)</div>" > ./client/index.html
                    cat ./template.html >> ./client/index.html`);
    })
});

// app.get('/', function (req, res) {
//     res.render(path.join(__dirname + '/client/index.html'));
// });  

// app.listen(port, () =>
//   console.log('Example app listening on port 3000!'),
// );