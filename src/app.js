//Imports
const express = require('express');
const request = require('request');
const anghamiService = require('../utils/anghamiService.js')
const indexService = require('../utils/indexService.js');
const bodyParser = require('body-parser');
const spotifyService = require('../utils/spotifyService');

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


spotifyService.spotifyLogin(spotifyClientId,spotifyClientSecret,(err,token)=>{
if(err)
spotifyToken = undefined;
else
spotifyToken = token;
})
   

app.get('/getSongByArtist', function (req, res) {
   var songQuery = req.query.query;
   var artistName = req.query.artistName;
   if (songQuery == undefined || artistName == undefined)
      return res.status(400).send("You need to send the song queyr and the artist name");

   var url = "https://bus.anghami.com/public/search";
   var outPut;
   anghamiService.getArtist(artistName, (localerr, localres) => {

      if (localerr == undefined) {
         anghamiService.getSongByArtist(localres.id,songQuery,(songErr,songRes)=>{
            if(songErr)
            return res.send(songErr);
            else
            return res.send(songRes);
         })
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
  anghamiService.getLatestSong((err,body)=>{
     if(err)
     res.send(err);
     else
     res.send(body);
  })

})

app.listen(port, function () {
   console.log("A7zanBot is listening on port:%s", port);
})