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
function add_new_song(song_ID, title, room_ID) {
    var song = db.collection('songs').where("SONG_ID", "==", song_ID)
    .get()
    .then(function(querySnapshot) {
        if(querySnapshot.exists){ //Song is already in database
            //Impl later, assume every song is unique
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

//Grabs the song on top of queue
function load_song(){
    // console.log("Current room" + room_ID);
        const room_ID = 1; //parse thru url later, hardcoded for now

    var display_container = document.getElementById("display_container");
    var new_song = "blank";
    db.collection('queue').where("ROOM_ID", "==", room_ID).orderBy("DATE_ADDED").limit(1)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            new_song = doc.data().SONG_ID;
            console.log(new_song);
            var display =` 
        <iframe width="420" height="315"src="https://www.youtube.com/embed/${new_song}"></iframe>
    `;
    display_container.innerHTML = display;// curr_vid(room_ID);
            return new_song;
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

}
function next_song(){
    var display_container = document.getElementById("display_container");
    var new_song = "blank";
    db.collection('queue').where("ROOM_ID", "==", room_ID).orderBy("DATE_ADDED").limit(2)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            new_song = doc.data().SONG_ID;
            console.log(new_song);
            var display =` 
        <iframe width="420" height="315"src="https://www.youtube.com/embed/${new_song}"></iframe>
    `;
    display_container.innerHTML = display;// curr_vid(room_ID);
            return new_song;
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}
