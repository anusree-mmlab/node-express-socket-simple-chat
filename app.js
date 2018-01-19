const express = require('express');
const app = express();

app.use(express.static(__dirname + '/node_modules')); 

/* app.use('/',(req, res, next) => {
    res.status(200).json({
        "message": "Sever connected successfully"
    });
}); */

app.use('/',(req, res, next) => {
    res.sendFile(__dirname + '/index.html');
});

module.exports = app;