//Imports
var express = require('express');

//Constants and Global Values
const port = process.env.PORT || 3000;
const anghamiToken = process.env.TOKEN;
var app = express();


app.get('/', function (req, res) {
    res.send(anghamiToken);
 })
 

 var server = app.listen(port, function () {
    var host = server.address().address;

    console.log("Example app listening on port:%s", port);
 })