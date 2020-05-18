
  const request = require('request');

  const spotifyLogin = (spotifyClientId,spotifyClientSecret,callback)=>{  
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
    request.post(spotifyOptions, function(error, response, body) {  
    if (!error && response.statusCode === 200) {
       spotifyToken = body.access_token;    
       callback(undefined,spotifyToken);
    }else{
        callback(error,undefined);
    }
    })
};

module.exports = {
    spotifyLogin
}
