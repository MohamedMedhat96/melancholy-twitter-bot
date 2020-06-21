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
const accumulatorPlaylistID = 186329603;


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
         if (outPut.results != undefined && outPut.results[0] != undefined) {
            var name = outPut.results[0].name
            var id = outPut.results[0].id
            for (let artist of outPut.results) {
               if (artist.name.toLowerCase() == artistName.toLowerCase()) {

                  name = artist.name
                  id = artist.id
                  break
               }
            }
            callback(undefined, { 'artist': outPut.results[0].name, 'id': outPut.results[0].id });
         }
         else
            callback("Artist not found", undefined);
      }
   });

}

const getSongByArtist = (artistid, songQuery, callback) => {
   var propertiesObject = { 'query': songQuery, 'searchType': 'song', page: 0, artistid: artistid }
   var url = "https://bus.anghami.com/public/search";
   request({ headers: headers, url: url, qs: propertiesObject }, function (err, response, body) {
      if (err) {
         return callback(err, undefined);
      }
      outPut = JSON.parse(body);
      if (outPut.data != undefined && outPut.data[0] != undefined)
         return callback(undefined, { 'title': outPut.data[0].title, 'artist': outPut.data[0].artist, url: 'https://play.anghami.com/song/' + outPut.data[0].id });
      else
         return callback("This song was not found", undefined);
   });
}

const getSong = (artistName, songQuery, callback) => {
   artistName = decodeURIComponent(artistName)
   songQuery = decodeURIComponent(songQuery)
   var propertiesObject = { 'query': songQuery + ' ' + artistName, 'searchType': 'song', page: 0 }
   var url = "https://bus.anghami.com/public/search";
   request({ headers: headers, url: url, qs: propertiesObject }, function (err, response, body) {
      if (err) {
         return callback(err, undefined);
      }
      outPut = JSON.parse(body);
      console.log(outPut)
      if (outPut.results != undefined && outPut.results[0] != undefined)
         return callback(undefined, { 'title': outPut.results[0].title, 'artist': outPut.results[0].artist, url: 'https://play.anghami.com/song/' + outPut.results[0].id });
      else
         return callback("This song was not found ", undefined);
   });
}
const getLatestSong = (callback) => {
   var url = "https://bus.anghami.com/public/playlist/data";
   var output;

   firebaseService.getIndex((err, index) => {
      var propertiesObject = { 'playlist_id': 175485967 }
      if (err)
         callback(err, undefined);
      request({ headers: headers, url: url, qs: propertiesObject }, function (err, response, body) {
         if (err) {
            return callback(err, undefined);
         }
         try {
            output = JSON.parse(body);
         }
         catch (e) {
            console.log(body)
            return callback("An error has occured", undefined);
         }
         if (output.data[index] != undefined) {
            callback(undefined, { 'title': output.data[index].title, 'artist': output.data[index].artist, url: 'https://play.anghami.com/song/' + output.data[index].id });
         } else
            callback("No song has been posted yet", undefined);
      });


   });

}
const updateAccumulatorPlaylist = (( songQuery, callback) => {
   songQuery = decodeURIComponent(songQuery)
   var propertiesObject = { 'song_id': songQuery, 'playlist_id': accumulatorPlaylistID}
   var url = "https://bus.anghami.com/public/playlist/add"
   request({ headers: headers, url: url, qs: propertiesObject }, function (err, response, body) {
      if (err) {
         return callback(err, undefined);
      }
      if(response.statusCode!=200){
         console.log("Error:" +response.statusCode+ response.statusMessage);
      }
      else {
         console.log("song successfully added to anghami playlist!");
      }
   });
})
module.exports =
{
   getArtist, getLatestSong, getSongByArtist, getSong, updateAccumulatorPlaylist
};
