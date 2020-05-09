const NO_VIDEO = -1;

var db = firebase.firestore();

//Grabs the current index in queue and increments it, increment is atomic
function incrIndex(){
    const room_ID = getPin();
    const increment = firebase.firestore.FieldValue.increment(1);
    console.log(increment);
    return db.collection('rooms').doc(room_ID).update({
        queueCounter: increment  
    })
}   

//Adds a song to the queue
async function addSongToDB(song_ID, title) {
    const room_ID = getPin();
    var currQueue = db.collection('rooms').doc(room_ID).collection("queue");
    var queueIndex = -1;
    let test = await incrIndex();
    db.collection('rooms').doc(room_ID).get().then(function(docSnapshot) {
        console.log("new " + docSnapshot.data().queueCounter)
        queueIndex =  docSnapshot.data().queueCounter;
    });
    db.collection('songs').doc(song_ID)
    .get()
    .then(function(querySnapshot) {
        if(querySnapshot.exists){ //Song is already in database, just add to queue
            currQueue.doc(song_ID).set({
                SONG_ID: song_ID,
                ROOM_ID: room_ID,
                QUEUE_INDEX: queueIndex
            });
        } else {
            db.collection("songs").doc(song_ID).set( {
                SONG_NAME: title
            });
            currQueue.doc(song_ID).set({
                SONG_ID: song_ID,
                ROOM_ID: room_ID,
                QUEUE_INDEX: queueIndex
            });
        }
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
