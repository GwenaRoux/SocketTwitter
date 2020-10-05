const mongoose = require('mongoose');

var TweetSchema = mongoose.Schema({
    user: {
        name: String,
        location: String,
    },
        created_at: String,
        id_str: String,
        text: String,
        entities: Array,
        geo: String,
        coordinates: String,
        place: String,
    profile_image_url: String,
});

const MyTweet = mongoose.model('myTweet', TweetSchema);

module.exports = MyTweet;
