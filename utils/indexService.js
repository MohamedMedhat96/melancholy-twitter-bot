//Imports
const request = require('request');

//Constants and Global Variables
const url = "https://a7zan-bot.firebaseio.com/index.json";

const getIndex = (callback) => {

    request(url, (error, res, body) => {
        if (error) {
            return callback(err, undefined);
        } else {
            callback(undefined, body);
        }
    })

}

const updateIndex = (index, callback) => {
    request.put({url:url, body:index} , (error, res, value) => {
        if (error) {
            return callback(error, undefined);
        } else {
            callback(undefined, value);
        }

    })
}

module.exports = {
    getIndex,
    updateIndex
}