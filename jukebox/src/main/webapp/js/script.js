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

//This function sets up the room page, getting the room name based on PIN
function presentRoom(isHost) {

    const queryParameters = new URLSearchParams(window.location.search);
    const roomRef = db.collection('rooms').doc(queryParameters.get('pin'))
    //If the a room with the PIN exists, then load its given components
    roomRef.get().then(function(roomSnapshot) {
        if (roomSnapshot.exists) {
            var groupName = roomSnapshot.data().name 
            //Distinguish between host and general user
            if (isHost) { 
                document.getElementById('group_name').textContent = roomSnapshot.data().name + " (Host)";
            } else {
                document.getElementById('group_name').textContent = roomSnapshot.data().name + " (General)";
            }
        } else {
            window.location.href = "/pin_error.html"
        }
    })
    document.getElementById("overlay_pin").textContent = queryParameters.get("pin")
}

//Displays pin on create_pin.html
function presentPIN() {

    const queryParameters = new URLSearchParams(window.location.search);
    document.getElementById('PIN').textContent = queryParameters.get('pin');
}

//Redirects user to their room after entering/creating a PIN
function joinGroup(isHost) {

    const queryParameters = new URLSearchParams(window.location.search);
    if (isHost) {
        window.location.href = '/room_host.html?pin=' + queryParameters.get('pin');;
    } else {
        window.location.href = '/room_general.html?pin=' + document.getElementById('pin').value;
    }
}

//Takes in a PIN and returns true if a room with the PIN already exists
function pinTaken(pinCode) {

    var roomRef = db.collection('rooms').doc(pinCode);
    var roomExists = false;
    roomRef.get().then(function(roomSnapshot) {
            if (roomSnapshot.exists) {
                roomExists = true;
            } else {
                roomExists = false;
        }
    })
    return roomExists;
}

//Adds a room to the database
function createRoom() {

    var pinCode = generatePIN();
    //Ensuring that pinCode is unique and not associated with a room in db
    while (pinTaken(pinCode)) {
        pinCode = generatePIN();
    }
    db.collection("rooms").doc(pinCode).set( {
        name: document.getElementById("group_name").value
    })
    window.location.href = "/create_pin.html?pin=" + pinCode;
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
