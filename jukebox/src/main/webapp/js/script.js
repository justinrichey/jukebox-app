/**
This file contains all database reads/writes as well some minor webpage
modifications. It's most likely not secure to have the database available
on the client-side, so this set-up is temporary (although will likely remain
as apart of the MVP)
 */

//Setting up Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDkEJE1taOS3R_dxakJjMB98I-3Apjuhxk",
    authDomain: "jukebox-sps.firebaseapp.com",
    databaseURL: "https://jukebox-sps.firebaseio.com",
    projectId: "jukebox-sps",
    storageBucket: "jukebox-sps.appspot.com",
    messagingSenderId: "729977109157",
    appId: "1:729977109157:web:0f47881639cc145866ab4c",
    measurementId: "G-9M791HTW5T"
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

//Authenticating the user anonymously
firebase.auth().signInAnonymously().catch(function(error) {
    window.location.href = "/auth_error.html"
})

//This runs when the user's auth state has changed (i.e succesful log in)
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        localStorage['uid'] = user.uid
    } 
  })

  //This function is called upon loading the room, used to load data for display
  function displayRoomData() {
    const queryParameters = new URLSearchParams(window.location.search)
    const queryPin = queryParameters.get('pin')
    if(!queryPin) {
        window.location.href = '/general_error.html'
    }
    displayRoomName()
    document.getElementById("overlay_pin").textContent = queryPin
  }

  //This function displays the room name
  //It uses a promise and cannot store values within the promise externally
  function displayRoomName() {
    const queryParameters = new URLSearchParams(window.location.search);
    const queryPin = queryParameters.get('pin')
    if(!queryPin) {
        window.location.href = '/general_error.html'
    }
    const roomRef = db.collection('rooms').doc(queryPin).get()
    if(!roomRef) {
        window.location.href = '/general_error.html'
    }
    
    roomRef.then(function(roomSnapshot) {
        if (roomSnapshot.exists) {
            document.getElementById("group_name").textContent = roomSnapshot.data().name
        } else {
            window.location.href = "/pin_error.html"
        }
    })
  }

//This function navigates the user based on their host status
//It uses a promise and cannot store values within the promise externally
function navigateToRoom(isCreatingRoom) {
    var storedUid = localStorage['uid']
    var queryPin
    if (isCreatingRoom) {
        const queryParameters = new URLSearchParams(window.location.search);
        queryPin = queryParameters.get('pin')
    } else {
        queryPin = document.getElementById('pin').value
    }
    if(!queryPin || !storedUid) {
        window.location.href = '/general_error.html'
    }
    const userRef = db.collection('rooms').doc(queryPin).collection('users').doc(storedUid)
    if(!userRef) {
        window.location.href = '/general_error.html'
    }
    userRef.get().then(function(userSnapshot) {
        //If the user does not yet exist in the db, then add and redirect them
        if (!userSnapshot.exists) {
            db.collection("rooms").doc(queryPin).collection("users").doc(storedUid).set( {
                isHost: false
            })
            window.location.href = '/room_general.html?pin=' + queryPin;
        } else {
            //Redirects to host or general page
            if(userSnapshot.data().isHost) {
                window.location.href = '/room_host.html?pin=' + queryPin;
            } else {
                window.location.href = '/room_general.html?pin=' + queryPin;
            }
        }
    })
}

//Displays pin on create_pin.html
function presentPIN() {
    const queryParameters = new URLSearchParams(window.location.search)
    var queryPin = queryParameters.get('pin')
    if(!queryPin) {
        window.location.href = '/general_error.html'
    }
    document.getElementById('PIN').textContent = queryPin
}

//Adds a room to the database
function createRoom() {
    var pinCode = generatePIN();
    var storedUid = localStorage['uid']
    if(!storedUid) {
        window.location.href = '/general_error.html'
    }
    var roomRef = db.collection('rooms').doc(pinCode);

    //Ensuring that pinCode is unique and not associated with a room in db
    roomRef.get().then(function(roomSnapshot) {
        if (roomSnapshot.exists) {
            //If it exists, then try again with a different PIN
            createRoom()
        } else {
            db.collection("rooms").doc(pinCode).set( {
                name: document.getElementById("group_name").value,
            })
            db.collection("rooms").doc(pinCode).collection("users").doc(storedUid).set( {
                isHost: true
            })
            window.location.href = "/create_pin.html?pin=" + pinCode;
        }
    })
}

//Generates a random, alphaNumeric 6-character string
function generatePIN() {
    var alphaNumeric = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var pinCode = "";
    for (var i = 0; i < 6; i++) {
        pinCode += alphaNumeric[Math.floor(Math.random() * alphaNumeric.length)];
    }
    return pinCode;
}

//For the pin display overlay (View Pin in the navbar)
function viewPin() {
    document.getElementById("view_pin").style.display = "flex";
}

function closePin() {
    document.getElementById("view_pin").style.display = "none";
}

function getPin(){
    const queryParameters = new URLSearchParams(window.location.search);
    const queryPin = queryParameters.get('pin');
    return queryPin;
}

function addSong(){
    var pinCode = getPin();
    window.location.href = "/add_song.html?pin=" + pinCode; //check if host or not
}

