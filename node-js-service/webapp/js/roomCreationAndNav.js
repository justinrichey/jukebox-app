/**
This file contains all database reads/writes regarding room creation, 
as well as functions related to navigating in/out of rooms. This client-side set-up is temporary 
(although will likely remain as apart of the MVP)
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
    initializePinOverlay()
}

function initializePinOverlay() {
    const queryParameters = new URLSearchParams(window.location.search)
    document.getElementById("overlay_pin").textContent = 
        (new URLSearchParams(window.location.search)).get('pin')
}

//This function displays the room name
//It uses a promise and cannot store values within the promise externally
function displayRoomName() {
    const queryParameters = new URLSearchParams(window.location.search);
    const queryPin = queryParameters.get('pin')
    if(!queryPin) {
        window.location.href = '/general_error.html'
    }

    var request = $.ajax({
        url: 'displayName',
        type: 'GET',
        data: $.param({pin: queryPin})
    });

    request.done(function (data) { 
        if (data == 'error') {
            window.location.href = "/pin_error.html";
        } else {
            document.getElementById("group_name").textContent = data;
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

    var request = $.ajax({
        url: 'navigateRoom',
        type: 'GET',
        data: $.param({userID: storedUid, pin: queryPin})
    });

    request.done(function (data) {
        if (data == 'general') {
            window.location.href = '/room_general.html?pin=' + queryPin;
        } else if (data == 'host') {
            window.location.href = '/room_host.html?pin=' + queryPin;
        } else {
            window.location.href = '/general_error.html';
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
function nodeCreateRoom() {
    var storedUid = localStorage['uid']
    if(!storedUid) {
        window.location.href = '/general_error.html'
    }
    var request = $.ajax({
        url: 'createRoom',
        type: 'GET',
        data: $.param({userID: storedUid, name: document.getElementById("group_name").value})
    });

    request.done(function (data) {
        console.log(data)
        if (data == 'error') {
            nodeCreateRoom();
        } else if (data != null) {
            window.location.href = "/create_pin.html?pin=" + data;
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

function gotoAddSong(){
    var pinCode = getPin();
    window.location.href = "/add_song.html?pin=" + pinCode; //check if host or not
}
