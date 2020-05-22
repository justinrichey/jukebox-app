const NO_VIDEO = -1;

var db = firebase.firestore();

//Grabs the current index in queue and increments it, increment is atomic

//Adds a song to the queue
async function addSongToDB(song_ID, title, thumbnailUrl) {
    const room_ID = getPin();
    var currQueue = db.collection('rooms').doc(room_ID).collection("queue");
    
    db.collection('songs').doc(song_ID)
    .get()
    .then(function(querySnapshot) {
        if(!querySnapshot.exists){
            db.collection("songs").doc(song_ID).set( {
                SONG_NAME: title,
                THUMBNAIL_URL: thumbnailUrl
            });
        }
        currQueue.add({
            SONG_ID: song_ID,
            ROOM_ID: room_ID,
            SONG_NAME: title,
            QUEUE_INDEX: firebase.firestore.FieldValue.serverTimestamp()
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

//Grabs the song on top of queue and Displays it, if true -> loads a new iframe, else replace existing
function load_song(getNextSong){
    const room_ID = getPin(); 
    var vidId = NO_VIDEO;
    db.collection('rooms').doc(room_ID).collection("queue").orderBy("QUEUE_INDEX").limit(1)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            //Right before playing, delete the row to show that the song is no longer queued
            deleteRow(doc.id);
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
    db.collection('rooms').doc(room_ID).collection("queue").orderBy("QUEUE_INDEX").limit(1)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
            new_song = doc.id;
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

function removeSong(songID) {
    db.collection('rooms').doc(getPin()).collection('queue').doc(songID).delete().then(function (querySnapshot) {
        console.log("Document successfully deleted!");   
    }).catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}
