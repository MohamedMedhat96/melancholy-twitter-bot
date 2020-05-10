//Imports
var express = require('express');

//Constants and Global Variables
const port = process.env.PORT || 3000;
const anghamiToken = process.env.TOKEN;
var app = express();


app.get('/getSongByArtist', function (req, res) {
    var songId = req.query.songId;
    var artistId = req.query.artistId;
    res.send(songId + " "+ artistId);
 })
 

 var server = app.listen(port, function () {
    var host = server.address().address;

    console.log("A7zanBot is listening on port:%s", port);
 })