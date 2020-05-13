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
            //If there is no video playing and the embedded player does not exist, then 
            //create an embedded player and play the newly added song
            if (isNoVideo && player == null) {
                getYouTube(change.doc.data().SONG_ID, false)
            } else if (isNoVideo && player) { //If there is no video playing but player has been initialized
                getYouTube(change.doc.data().SONG_ID, true)
            }
            if (querySnapshot.length != 0 && querySnapshot.docs[0].data().QUEUE_INDEX != change.doc.data().QUEUE_INDEX) {
    
            var numRows = document.getElementById("song_table").rows.length;
            var newRow = document.getElementById("song_table").insertRow();
            newRow.id = change.doc.data().QUEUE_INDEX;
            var tableSongName = newRow.insertCell(0);
            var tableSongThumbnail = newRow.insertCell(1);
            var tableRemoveButton = newRow.insertCell(2);

            //Changing the html
            db.collection('songs').doc(change.doc.data().SONG_ID).get().then(function(songsSnapshot) {
                tableSongName.innerHTML = `<p>${songsSnapshot.data().SONG_NAME}</p>`;
                tableSongThumbnail.innerHTML = `<img src=${songsSnapshot.data().THUMBNAIL_URL}>`
                tableRemoveButton.innerHTML = 
                `<button type="button" class="remove_button" onclick="removeSong('${change.doc.data().SONG_ID}')">-</button>`;
            }).catch(function(error) {
                console.log("Error getting documents: ", error);
            })
            }
        } else if (change.type == 'removed') {
            deleteRow(change.doc.data().QUEUE_INDEX);
        }        
    })
});
