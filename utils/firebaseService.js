//Imports
const request = require('request');

//Constants and Global Variables
const url = "https://a7zan-bot.firebaseio.com/";

const getIndex = (callback) => {
    var methodUrl = url + 'index.json'
    request(methodUrl, (error, res, body) => {
        if (error) {
            return callback(error, undefined);
        } else {
            callback(undefined, body);
        }
    })

}

const updateIndex = (index, callback) => {
    var methodUrl = url + 'index.json'
    request.put({url:methodUrl, body:index} , (error, res, value) => {
        if (error) {
            return callback(error, undefined);
        } else {
            callback(undefined, value);
        }

    })
}

const getStatus=(callback)=>{
    var methodUrl = url + 'description.json'
    request(methodUrl, (error, res, body) => {
        if (error) {
            return callback(error, undefined);
        } else {
            callback(undefined, JSON.parse(body));
        }
    })
}

const updateStatus=(status, callback)=>{
    var methodUrl = url + 'description.json'
    status = JSON.stringify(status)
    request.put({url:methodUrl, body:status} , (error, res, value) => {
        if (error) {
            return callback(error, undefined);
        } else {
            callback(undefined, JSON.parse(value));
        }

    })
   
}
module.exports = {
    getIndex,
    updateIndex,
    getStatus,
    updateStatus
}