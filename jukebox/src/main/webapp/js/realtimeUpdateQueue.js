/**
This file keeps track of the table on the main room page. It updates the queue when a song is added
or removed in realtime. 
 */

var db = firebase.firestore();

function deleteRow(rowID) {   
    var row = document.getElementById(rowID);
    if (row) {
        row.parentNode.removeChild(row);
    }
}

db.collection('rooms').doc(getPin()).collection('queue')
    .orderBy('QUEUE_INDEX').onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
        
        //If the listener responds to a song being added
        if (change.type == 'added') {
            var isFirstOnQueue = querySnapshot.docs[0].data().QUEUE_INDEX.isEqual(change.doc.data().QUEUE_INDEX);
            //If there is no video playing and the embedded player does not exist
            if (window.location.pathname == "/room_host.html" && currVidID == NO_VIDEO && player == null) {
                //pass in false to create embedded player
                getYouTube(change.doc.data().SONG_ID, false);

            //If there is no video playing but player has been initialized
            } else if (window.location.pathname == "/room_host.html" && currVidID == NO_VIDEO && player) {
                //pass in true to indicate player exists
                getYouTube(change.doc.data().SONG_ID, true);
            }
            
            if (!querySnapshot.empty && !isFirstOnQueue) {
    
                var numRows = document.getElementById("song_table").rows.length;
                var newRow = document.getElementById("song_table").insertRow();
                newRow.id = change.doc.id;
                var tableSongName = newRow.insertCell(0);
                var tableSongThumbnail = newRow.insertCell(1);
                var tableRemoveButton = newRow.insertCell(2);

                //Changing the html
                db.collection('songs').doc(change.doc.data().SONG_ID).get().then(function(songsSnapshot) {
                    tableSongName.innerHTML = `<p>${songsSnapshot.data().SONG_NAME}</p>`;
                    tableSongThumbnail.innerHTML = `<img src=${songsSnapshot.data().THUMBNAIL_URL}>`;
                    tableRemoveButton.innerHTML = `<button type="button" class="remove_button" 
                        onclick="removeSong('${change.doc.id}')">-</button>`;

                }).catch(function(error) {
                    console.log("Error getting documents: ", error);
                });
            }
        } else if (change.type == 'removed') {
            deleteRow(change.doc.id);
            console.log("Hello")    
        }
    });
    if (!querySnapshot.empty) {
        console.log(querySnapshot.empty)
        display_container.innerHTML = `Currently playing <b>${querySnapshot.docs[0].data().SONG_NAME}</b>`;
    } else {
        display_container.innerHTML = `No songs in queue.`;
    }
});
