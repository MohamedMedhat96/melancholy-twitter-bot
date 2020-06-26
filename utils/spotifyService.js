const request = require('request')
const spotifyClientId = process.env.CLIENTID
const spotifyClientSecret = process.env.CLIENTSECRET
const accumulatorPlaylistID = "1L92urVus8OP0CGGXEQa2l"
const refreshToken = process.env.REFRESHTOKEN
var spotifyToken;
const spotifyLogin = (callback) => {
    const spotifyOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        },
        json: true
    };
    request.post(spotifyOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            spotifyToken = body.access_token;
            console.log(spotifyToken)
            callback(undefined, spotifyToken);
        } else {
            console.log(body)
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
    spotifyOptions.url = spotifyOptions.url + '?q=track:' + songQuery.replace(/\s/g, "%20") + '%20artist:' + artistName.replace(/\s/g, "%20") + '&type=track'
    request.get(spotifyOptions, function(error, response, body) {
        console.log(spotifyOptions.url)
        if (!error) {
            if (body != undefined && body.tracks != undefined && body.tracks.items[0] != undefined) {
                var response = { songUrl: body.tracks.items[0].external_urls.spotify, artist: body.tracks.items[0].artists[0].name, title: body.tracks.items[0].name, uri: body.tracks.items[0].uri }
                console.log(response)
                callback(undefined, response)
            } else {
                console.log(body)
                callback({ error: "Song not found on spotify" }, undefined);
            }
        } else {
            console.log(error)
            callback(error, undefined);
        }
    })
}

const spotifyUpdateAccumulatorPlaylist = (songURI, callback) => {

    var spotifyOptions = {
        url: 'https://api.spotify.com/v1/playlists/' + accumulatorPlaylistID + '/tracks',
        headers: {
            'Authorization': 'Bearer ' + spotifyToken,
            'Content-Type': 'application/json'
        },
        json: true
    };
    spotifyOptions.url = spotifyOptions.url + '?uris=' + songURI;
    request.post(spotifyOptions, function(error, response, body) {
        console.log(spotifyOptions.url)
        if (error) {
            return callback(err, undefined);
        }
        if (response.statusCode != 201) {
            console.log("Error:" + response.statusCode + response.statusMessage)
            return callback(err, undefined)
        } else {
            console.log("song successfully added to spotify playlist!")
            callback(undefined, "song added")
        }
    })

}

module.exports = {
    spotifyLogin,
    spotifyGetSong,
    spotifyUpdateAccumulatorPlaylist
}