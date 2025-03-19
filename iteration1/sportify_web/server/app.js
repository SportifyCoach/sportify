const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const connection = mysql.createConnection({
    host: "ubiwan.epsevg.upc.edu",
    port: '3306',
    user: "amep10",
    password: "iKae6iePa7aiH6",
    database: "amep10"
})

connection.promise().connect()
    .then(() => {
        console.log('Connection with MySQL successful');
    })
    .catch(err => {
        console.error('Error trying to connect with MySQL:', err);
    });

    
module.exports = app;
