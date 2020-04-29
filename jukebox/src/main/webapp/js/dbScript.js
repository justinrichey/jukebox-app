const NO_VIDEO = -1;

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

//Adds a song to the queue
function addSongDB(song_ID, title, room_ID) {
    var song = db.collection('songs').where("SONG_ID", "==", song_ID)
    .get()
    .then(function(querySnapshot) {
        if(querySnapshot.exists){ //Song is already in database, just add to queue
            db.collection("queue").doc(song_ID).set( {
                SONG_ID: song_ID,
                ROOM_ID: room_ID,
                DATE_ADDED: Date.now()
            });
        } else {
            db.collection("songs").doc(song_ID).set( {
                SONG_ID: song_ID,
                SONG_NAME: title
            });
            db.collection("queue").doc(song_ID).set( {
                SONG_ID: song_ID,
                ROOM_ID: room_ID,
                DATE_ADDED: Date.now()
            });
        }
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

//Grabs the song on top of queue and return it
function load_song(nextSong){
    const room_ID = getPin(); 
    
    var vidId = NO_VIDEO;

    db.collection('queue').where("ROOM_ID", "==", room_ID).orderBy("DATE_ADDED").limit(1)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            vidId = doc.data().SONG_ID;
        });
        getYouTube(vidId, nextSong);
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    
}

//displays the next song
function next_song(){
    const room_ID = getPin(); //parse thru url later, hardcoded for now

    var display_container = document.getElementById("display_container");
    var new_song;
    
    
    //Delete from queue collection and advance to next song, TODO: deleting from song collection
    db.collection('queue').where("ROOM_ID", "==", room_ID).orderBy("DATE_ADDED").limit(1)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            new_song = doc.data().SONG_ID;
            console.log("Deleting " + new_song);

            doc.ref.delete().then(() => {
                console.log("Document successfully deleted!");
                load_song(true);
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
            
            
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

    
}
