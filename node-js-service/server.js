const express = require('express');
const app = express();
const admin = require('firebase-admin');
var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var youtube = google.youtube({
   version: 'v3',
   auth: "hidden"
});
var OAuth2 = google.auth.OAuth2;

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});
process.env.GCLOUD_PROJECT = 'jukebox-sps';
const db = admin.firestore();

app.get('/createRoom', (req, res) => {
    var alphaNumeric = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var pinCode = "";
    for (var i = 0; i < 6; i++) {
        pinCode += alphaNumeric[Math.floor(Math.random() * alphaNumeric.length)];
    }
    let roomRef = db.collection('rooms').doc(pinCode);
    roomRef.get().then((snapshot) => {
        if (snapshot.exists) {
            res.send('error');
        } else {
            db.collection("rooms").doc(pinCode).set({
                name: req.query.name
            }).then(function (groupCreatedRef) {
                //The person creating the room is the host
                db.collection("rooms").doc(pinCode).collection("users").doc(req.query.userID).set( {
                    isHost: true
                }).then(function(userAddedRef) {
                    res.send(pinCode);
                })
            })
        }
    }).catch((err) => {
        console.log('Error getting documents', err);
    });
})

app.get('/navigateRoom', (req, res) => {
    const userRef = db.collection('rooms').doc(req.query.pin).collection('users').doc(req.query.userID);
    if(!userRef) {
        res.send('-1');
    }

    userRef.get().then(function(userSnapshot) {
        if (!userSnapshot.exists) {
            db.collection("rooms").doc(queryPin).collection("users").doc(req.query.userID).set( {
                isHost: false
            })
            res.send('general');
        } else {
            //Redirects to host or general page
            if(userSnapshot.data().isHost) {
                res.send('host');
            } else {
                res.send('general');
            }
        }
    }).catch((err) => {
        console.log('Error getting documents', err);
    });
})

app.get('/displayName', (req, res) => {
    const roomRef = db.collection('rooms').doc(req.query.pin).get();

    roomRef.then(function(roomSnapshot) {
        if (roomSnapshot.exists) {
            res.send(roomSnapshot.data().name);
        } else {
            res.send('error');
        }
    })
})


app.get('/searchRequest', (req, res) => {
    return youtube.search.list({
      "part": "snippet",
      "maxResults": req.query.numOfVids,
      "q": req.query.term,
      "type": "video"
    })
        .then(function(response) {
                res.send(response.data.items);
        },
        function(err) { console.error("Execute error", err); });
})
app.use(express.static(__dirname + "/webapp"));
