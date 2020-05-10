//Imports
var express = require('express');
var request = require('request');

//Constants and Global Variables
const port = process.env.PORT || 3000;
const anghamiToken = process.env.TOKEN;
const headers = { 
   'Content-Type':'application/json',
   'XAT':'interns',
   'XATH':anghamiToken
};
var app = express();



const getArtist = (artistName,callback)=>{
   let url = "https://bus.anghami.com/public/search";
   let propertiesObject = {'query':artistName,'searchType':'artist',page:0}
   request({headers:headers,url:url, qs:propertiesObject}, function(err, response, body) {
      if(err) {
         return callback(err, undefined);
      }
     if(response.statusCode != 200)
     return callback("200", undefined);
     else{
      let outPut = JSON.parse(body);
      callback(undefined,{'artist': outPut.results[0].name  , 'id':outPut.results[0].id});
     } 
   });
    
}


app.get('/getSongByArtist', function (req, res) {
    var songQuery = req.query.query;
   var artistName = req.query.artistName;
   var url = "https://bus.anghami.com/public/search";
   var outPut;
   getArtist(artistName,(err,localres)=>
   {
      console.log(artistName);
      console.log(localres.artist.toLowerCase());
      if(err==undefined){
            var propertiesObject = {'query':songQuery,'searchType':'song',page:0,artistid:localres.id}
      
      
      request({headers:headers,url:url, qs:propertiesObject}, function(err, response, body) {
         if(err) { console.log(err); return; }
         console.log("Get response: " + response.statusCode);
         outPut = JSON.parse(body);
         if(outPut.title!=undefined)
         return res.send({'title':outPut.results[0].title, 'artist': outPut.results[0].artist, url:'https://play.anghami.com/song/'+outPut.results[0].id});
         else
         res.send("This song was not found");
      });
      }
      else
      return res.send(err);

   })

  
   
    
 })
 

 var server = app.listen(port, function () {
    var host = server.address().address;

    console.log("A7zanBot is listening on port:%s", port);
 })