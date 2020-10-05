const Twit = require('twit');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const keys = require('./APIKeys');
const twitterIds = require('./twitterids');

app.use('/source', express.static(__dirname + '/client/source/'));


////////////////////////database////////////////////////////
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mytweets', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connecting error'));

db.once('open', function () {
    // we're connected!
    console.log('DB connected on port 27017');
});

// Schemas
const MyTweets = require('./server/models/mytweets');
const Sensor = require('./server/models/sensors');
////////////////////////database////////////////////////////

var Tweet = new Twit({
    consumer_key: keys.consumer_key,
    consumer_secret: keys.consumer_secret,
    access_token: keys.access_token,
    access_token_secret: keys.access_token_secret,
});

// var stream = Tweet.stream('statuses/filter', {track: ['#javascript', '#iot']});
//
// stream.on('tweet', function (tweet) {
//     io.emit('tweet', {'tweet': tweet});
//     console.log(tweet)
// });

var streamuser = Tweet.stream('statuses/filter', {follow: [twitterIds.myid]});
////////////////////Store my tweets in the DB and emit the color to mytweets.html/////////////////////////////
streamuser.on('tweet', function (tweet) {
    let content = tweet.text;
    // console.log(content);
    // var tweetdb = new MyTweets(tweet);
    // tweetdb.save().then(function () {
    //     console.log('Object saved with id : ' + tweetdb.id)
    // });

    if (content.includes('#color')) {
        content = content.replace(/#\S+/g, '');
        content = content.replace(/\s+/g, '');
        console.log(content);
        io.emit('backgroundcolor', {'color': content});
    } else if (content.includes('#temp')) {
        content = content.replace(/#\S+/g, '');
        content = content.replace(/\s+/g, '');
        var newTemp = {
            name: "temperature sensor",
            sensor_type: 'temp',
            value: content
        };
        var tempdb = new Sensor(newTemp);
        tempdb.save().then(function () {
            console.log('Object saved with id : ' + tempdb.id);
            // io.emit('tempChange', {'newTemp': content});
        });
    } else if (content.includes('#hum')) {
        content = content.replace(/#\S+/g, '');
        content = content.replace(/\s+/g, '');
        var newHum = {
            name: "humidity sensor",
            sensor_type: 'hum',
            value: content
        };
        var humdb = new Sensor(newHum);
        humdb.save().then(function () {
            console.log('Object saved with id : ' + humdb.id);
            // io.emit('humChange', {'newHum': content});
        });
    }
});
////////////////Api routes/////////////////
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/client/index.html");
});

app.get('/tweets', function (req, res) {
    res.sendFile(__dirname + "/client/tweets.html");
});

app.get('/mytweets', function (req, res) {
    res.sendFile(__dirname + "/client/mytweets.html");
});

app.get('/dataviz', function (req, res) {
    res.sendFile(__dirname + "/client/dataviz.html");
});

app.get('/api/mytweets', function (req, res) {
    MyTweets.find({}).exec(function (err, myTweetsList) {
        if (err) {
            console.log(err)
        }
        res.json(myTweetsList);
    })
});

app.get('/api/sensors/:stype', function(req, res) {


    Sensor.find({"sensor_type" : req.params.stype}).exec(function(err, mySensorList) {
        if (err) {
            console.log(err);
        }
        res.json(mySensorList);

    });


});

//////////////Sever start///////////////////
server.listen(3000, function () {
    console.log('server listening on http://localhost:3000!')
});
