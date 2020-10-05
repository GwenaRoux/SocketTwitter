const socket = io();
const background = document.querySelector('#background');
const cont = document.querySelector('#container');

// Récupération
socket.on('backgroundcolor', function (content) {
    background.style.backgroundColor = content.color;
});

fetch('/api/mytweets')
    .then((response) => {
        return response.json(); // or .text() or .blob() ...
    })
    .then((body) => {
        // text is the response body
        console.log(body);
        body.forEach(function (myTweet) {
            createtweet(myTweet)
        })
    })
    .catch((e) => {
        // error in e.message
    });

function createtweet(tweetbody) {
    var tweetcont = document.createElement('div');
    tweetcont.classList.add('tweetcont');
    var p = document.createElement('p');
    p.innerHTML = tweetbody.text;
    tweetcont.appendChild(p);
    cont.appendChild(tweetcont);
}
