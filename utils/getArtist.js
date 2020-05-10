//Imports
const request = require('request')
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
         return callback("200", undefined);
      else {
         let outPut = JSON.parse(body);
         callback(undefined, { 'artist': outPut.results[0].name, 'id': outPut.results[0].id });
      }
   });

}
module.exports = getArtist;
