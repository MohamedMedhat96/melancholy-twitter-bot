//Imports
const express = require('express');
const request = require('request');
const getArtist = require('../utils/getArtist.js')
const indexService = require('../utils/indexService.js');
const bodyParser = require('body-parser')

//Constants and Global Variables
const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());
const anghamiToken = process.env.TOKEN;
const spotifyClientId = process.env.CLIENTID;
const spotifyClientSecret=process.env.CLIENTSECRET;
var spotifyToken;

const headers = {
   'Content-Type': 'application/json',
   'XAT': 'interns',
   'XATH': anghamiToken
};

const spotifyOptions = {
   url: 'https://accounts.spotify.com/api/token',
   headers: {
     'Authorization': 'Basic ' + (Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64'))
   },
   form: {
     grant_type: 'client_credentials'
   },
   json: true
 };
 
   request.post(authOptions, function(error, response, body) {
   if (!error && response.statusCode === 200) {
 
      spotifyToken = body.access_token;    
      console.log(spotifyToken);
   }
   });

   

app.get('/getSongByArtist', function (req, res) {
   var songQuery = req.query.query;
   var artistName = req.query.artistName;
   if (songQuery == undefined || artistName == undefined)
      return res.status(400).send("You need to send the song queyr and the artist name");

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
         return res.send(localerr);

   })




})

app.post('/setIndex', function (req, res) {
   var indexValue = req.query.index;

   indexService.updateIndex(indexValue, (err, index) => {
      if (err)
         return res.status(500).send("An internal server error has occured, index was not updated: " + updateErr);
      else
         return res.status(200).send("Index updated succesfully, Index:" + index);
   })
})

app.post('/updateIndex', function (req, res) {
   indexService.getIndex((err, index) => {
      if (err == undefined) {
         indexService.updateIndex((JSON.parse(index) + 1).toString(), (updateErr, updateRes) => {
            if (updateErr)
               return res.status(500).send("An internal server error has occured, index was not updated: " + updateErr);
            else
               return res.status(200).send("Index updated succesfully");
         }
         )

      }
      else {
         return res.status(500).send("An internal server error has occured, index was not updated");
      }

   })
})


app.get('/latestSong', function (req, res) {
   var url = "https://bus.anghami.com/public/playlist/data";
   var output;

   indexService.getIndex((err, index) => {
      var propertiesObject = { 'playlist_id': 175485967 }
      console.log(index);
      request({ headers: headers, url: url, qs: propertiesObject }, function (err, response, body) {
         if (err) { console.log(err); return; }
         console.log("Get response: " + response.statusCode);
         outPut = JSON.parse(body);
         if (outPut.data[index] != undefined) {
            res.send({ 'title': outPut.data[index].title, 'artist': outPut.data[index].artist, url: 'https://play.anghami.com/song/' + outPut.data[index].id });
         } else
            res.send("No song has been posted yet");
      });


   });


})

app.listen(port, function () {
   console.log("A7zanBot is listening on port:%s", port);
})