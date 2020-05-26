//Imports
const request = require('request')
const firebaseService = require('./firebaseService')
//Constants and Global Variables
const anghamiToken = process.env.TOKEN;
const headers = {
   'Content-Type': 'application/json',
   'XAT': 'interns',
   'XATH': anghamiToken
};


const getArtist = (artistName, callback) => {
   let url = "https://bus.anghami.com/public/search";
   let propertiesObject = { 'query': artistName, 'searchType': 'artist', page: 0 }
   request({ headers: headers, url: url, qs: propertiesObject }, function (err, response, body) {
      if (err) {
         return callback(err, undefined);
      }
      if (response.statusCode != 200)
         return callback(response.statusCode, undefined);
      else {
         let outPut = JSON.parse(body);
         if (outPut.results[0] != undefined)
            callback(undefined, { 'artist': outPut.results[0].name, 'id': outPut.results[0].id });
         else
            callback("Artist not found", undefined);
      }
   });

}

const getSongByArtist=(artistid, songQuery, callback)=>{
   var propertiesObject = { 'query': songQuery, 'searchType': 'song', page: 0, artistid: artistid }
   var url = "https://bus.anghami.com/public/search";

   request({ headers: headers, url: url, qs: propertiesObject }, function (err, response, body) {
      if (err) { 
        return callback(err,undefined);
       }
      outPut = JSON.parse(body);
      if (outPut.results[0] != undefined)
         return callback(undefined,{ 'title': outPut.results[0].title, 'artist': outPut.results[0].artist, url: 'https://play.anghami.com/song/' + outPut.results[0].id });
      else
         return callback("This song was not found",undefined);
   });
}

const getLatestSong = (callback) => {
   var url = "https://bus.anghami.com/public/playlist/data";
   var output;

   firebaseService.getIndex((err, index) => {
      var propertiesObject = { 'playlist_id': 175485967 }
      if(err)
      callback(err,undefined);
      request({ headers: headers, url: url, qs: propertiesObject }, function (err, response, body) {
         if (err) {
            return callback(err,undefined);
         }
         output = JSON.parse(body);
         if (output.data[index] != undefined) {
            callback(undefined,{ 'title': output.data[index].title, 'artist': output.data[index].artist, url: 'https://play.anghami.com/song/' + output.data[index].id });
         } else
            callback("No song has been posted yet",undefined);
      });


   });

}
module.exports =
{
   getArtist,getLatestSong,getSongByArtist
};
