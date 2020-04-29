function generateGroup() {

    //send to server once database schema decided
    var groupName = document.getElementById('group_name').value;
    window.location.href = '/create_pin.html';
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var dbAuth = firebase.auth();

// Authenticating the user anonymously
firebase.auth().signInAnonymously().catch(function(error) {
    console.log("Error authenticating")
    window.location.href = "/auth_error.html"
})

//This runs when the user's auth state has changed (i.e succesful log in)
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        localStorage['uid'] = user.uid
    } else {
        console.log("error no user")
        window.location.href = "/auth_error.html"
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

function getPin(){
    const queryParameters = new URLSearchParams(window.location.search);
    queryPin = queryParameters.get('pin');
    return queryPin;
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
    
    //Eventually put this on java serverside code once database schema decided
    var alphaNumeric = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var PIN = '';
    for(var i = 0; i < 6; i++) {
        PIN += alphaNumeric[Math.floor(Math.random() * alphaNumeric.length)];
    }
    document.getElementById('PIN').textContent = PIN;
}

function joinGroup(isHost) {
    if (isHost) {
        window.location.href = '/room_host.html';
    } else {
        window.location.href = '/room_general.html';
    }
}