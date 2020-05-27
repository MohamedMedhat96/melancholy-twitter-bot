
const request = require('request');
const spotifyClientId = process.env.CLIENTID;
const spotifyClientSecret = process.env.CLIENTSECRET;
var spotifyToken;
const spotifyLogin = (callback) => {
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
  request.post(spotifyOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      spotifyToken = body.access_token;
      callback(undefined, spotifyToken);
    } else {
      callback(error, undefined);
    }
  })
}



const spotifyGetSong = (artistName, songQuery, callback) => {
  var spotifyOptions = {
    url: 'https://api.spotify.com/v1/search',
    headers: {
      'Authorization': 'Bearer ' + spotifyToken
    },
    json: true
  };
  spotifyOptions.url = spotifyOptions.url + '?q=artist:' + artistName.replace(" ", "%20") + '&track:' + songQuery.replace(" ", "%20") + '&type=track'
  request.get(spotifyOptions, function (error, response, body) {
    console.log(spotifyOptions.url)
    if (!error) {
      if (body != undefined &&  body.tracks.items[0]!= undefined) {
        var response = { songUrl: body.tracks.items[0].external_urls.spotify, artist: body.tracks.items[0].artists[0].name, title : body.tracks.items[0].name }
        console.log(response)
        callback(undefined, response)
      } else {
        callback({error:"Song not found on spotify"}, undefined);
      }
    } else {
      console.log(error)
      callback(error, undefined);
    }
  })
}

module.exports = {
  spotifyLogin, spotifyGetSong
}
