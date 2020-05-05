const NO_VIDEO = -1;

var db = firebase.firestore();

//Adds a song to the queue
function addSongDB(song_ID, title, room_ID) {
    db.collection('songs').where("SONG_ID", "==", song_ID)
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

//Grabs the song on top of queue and Displays it
function load_song(getNextSong){
    const room_ID = getPin(); 
    var vidId = NO_VIDEO;
    db.collection('queue').where("ROOM_ID", "==", room_ID).orderBy("DATE_ADDED").limit(1)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            vidId = doc.data().SONG_ID;
        });
        getYouTube(vidId, getNextSong);
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

//finds the next song
function next_song(){
    const room_ID = getPin(); 
    var new_song;
    //Delete from queue collection and advance to next song, TODO: deleting from song collection
    db.collection('queue').where("ROOM_ID", "==", room_ID).orderBy("DATE_ADDED").limit(1)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
            new_song = doc.data().SONG_ID;
            console.log("Deleting " + new_song);
            doc.ref.delete().then(() => {
                console.log("Document successfully deleted!"); //TODO: implement deleting for songs
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
