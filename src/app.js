//Imports
const express = require('express');
const request = require('request');
const getArtist = require('../utils/getArtist.js')
const indexService = require('../utils/indexService.js');

//Constants and Global Variables
const port = process.env.PORT || 3000;
const app = express();
const anghamiToken = process.env.TOKEN;
const headers = {
   'Content-Type': 'application/json',
   'XAT': 'interns',
   'XATH': anghamiToken
};



app.get('/getSongByArtist', function (req, res) {
   var songQuery = req.query.query;
   var artistName = req.query.artistName;
   if(songQuery==undefined || artistName==undefined)
   return res.sendStatus(400).statusMessage("You need to send the song queyr and the artist name");
   
   var url = "https://bus.anghami.com/public/search";
   var outPut;
   getArtist(artistName, (localerr, localres) => {

      if (localerr == undefined) {
         var propertiesObject = { 'query': songQuery, 'searchType': 'song', page: 0, artistid: localres.id }


         request({ headers: headers, url: url, qs: propertiesObject }, function (err, response, body) {
            if (err) { console.log(err); return; }
            console.log("Get response: " + response.statusCode);
            outPut = JSON.parse(body);
            if (outPut.results[0] != undefined)
               return res.send({ 'title': outPut.results[0].title, 'artist': outPut.results[0].artist, url: 'https://play.anghami.com/song/' + outPut.results[0].id });
            else
               res.send("This song was not found");
         });
      }
      else
         return res.sendStatus(localerr);

   })




})


app.listen(port, function () {
   console.log("A7zanBot is listening on port:%s", port);
})