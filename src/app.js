//Imports
const express = require('express');
const anghamiService = require('../utils/anghamiService.js')
const firebaseService = require('../utils/firebaseService.js');
const bodyParser = require('body-parser');
const spotifyService = require('../utils/spotifyService');

//Constants and Global Variables
const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());


spotifyService.spotifyLogin((err, res) => {

})

app.get('/getSongByArtistSpotify', function(req, res) {

    var songQuery = req.query.query;
    var artistName = req.query.artistName;
    if (songQuery == undefined || artistName == undefined)
        return res.status(400).send("You need to send the song query and the artist name");
    spotifyService.spotifyGetSong(artistName, songQuery, (err, response) => {
        if (err)
            return res.status(500).send(err);
        else
            return res.send(response);
    })
})

app.post('/updateAPI', function(req, res) {

    spotifyService.spotifyLogin((error, update) => {
        if (error)
            res.status(500).send(error)
        else
            res.status(200).send()
    })
})


app.get('/getBuildStatus', function(req, res) {
    firebaseService.getStatus((error, response) => {
        if (error)
            res.status(500).send(error)
        else
            res.status(200).send(response)
    })
})

app.post('/updateBuildStatus', function(req, res) {
    var status = req.body;
    firebaseService.updateStatus(status, (err, response) => {
        if (err)
            return res.status(500).send(err);
        else {
            //console.log(response)
            return res.send(response);
        }
    })
})

app.get('/getSongByArtist', function(req, res) {
    var songQuery = req.query.query;
    var artistName = req.query.artistName;
    if (songQuery == undefined || artistName == undefined)
        return res.status(400).send("You need to send the song query and the artist name");

    var url = "https://bus.anghami.com/public/search";
    var outPut;
    anghamiService.getArtist(artistName, (localerr, localres) => {

        if (localerr == undefined) {
            anghamiService.getSongByArtist(localres.id, songQuery, (songErr, songRes) => {
                if (songErr) {
                    anghamiService.getSong(artistName, songQuery, (searchErr, searchRes) => {
                        if (searchErr)
                            return res.status(500).send(searchErr);
                        else
                            return res.send(searchRes);
                    })
                } else
                    return res.send(songRes);
            })
        } else
            anghamiService.getSong(artistName, songQuery, (searchErr, searchRes) => {
                if (searchErr)
                    return res.status(500).send(searchErr);
                else
                    return res.send(searchRes);
            })


    })




})

app.post('/setIndex', function(req, res) {
    var indexValue = req.query.index;

    firebaseService.updateIndex(indexValue, (err, index) => {
        if (err)
            return res.status(500).send("An internal server error has occured, index was not updated: " + updateErr);
        else
            return res.status(200).send("Index updated succesfully, Index:" + index);
    })
})

app.post('/updateIndex', function(req, res) {
    firebaseService.getIndex((err, index) => {
        if (err == undefined) {
            firebaseService.updateIndex((JSON.parse(index) + 1).toString(), (updateErr, updateRes) => {
                if (updateErr)
                    return res.status(500).send("An internal server error has occured, index was not updated: " + updateErr);
                else
                    return res.status(200).send("Index updated succesfully");
            })

        } else {
            return res.status(500).send("An internal server error has occured, index was not updated");
        }

    })
})



app.get('/latestSong', function(req, res) {
    anghamiService.getLatestSong((err, body) => {
        if (err)
            res.status(500).send(err);
        else
            res.send(body);
    })

})

app.get('/updateAccumulatorPlaylist', function(req, res) {
    anghamiService.updateAccumulatorPlaylist(req.query.songID, (err, body) => {
        if(err){
            console.log(err)
        }

    })
    spotifyService.spotifyUpdateAccumulatorPlaylist(req.query.songURI, (err, body) => {
        if(err){
            console.log(err)
        }

    })
    res.send()


})


app.listen(port, function() {
    console.log("A7zanBot is listening on port:%s", port);
})