var CLIENT_ID = "hidden";
var API_KEY = "hidden";

// Displays a list of videos resulting from search
function displayVideos(videos){
    //parse through data, create a list with the title being clickable leading to youtube video, and a button
    var result_container = document.getElementById("result_container");
    if(videos.length > 0){
        //Loop through videos and append to output
        videos.forEach(vid =>{
            const vid_title = checkSpecial(vid.snippet.title);
            const vid_thumbnail = vid.snippet.thumbnails.default.url;
            const vid_ID = vid.id.videoId;

            var newRow = document.getElementById("result_table").insertRow();
            var tableSongName = newRow.insertCell(0);
            var tableSongThumbnail = newRow.insertCell(1);
            var tableAddButton = newRow.insertCell(2);

            tableSongName.innerHTML = `<p>${vid.snippet.title}</p>`;
            tableSongThumbnail.innerHTML = `<img src=${vid_thumbnail}>`
            tableAddButton.innerHTML = 
                `<button type="button" onclick="addSongToDB('${vid_ID}', '${vid_title}', '${vid_thumbnail}')" 
                class="add_button">+</button>`;
        })
    } else {
        result_container.innerHTML = `No Videos Found`;
    }
}

//Checks for special characters, if so, adds a backslash before
function checkSpecial(givenTitle){
    for(var index = 0; index < givenTitle.length;){
        var indexLoc = givenTitle.indexOf("&#39;", index);
        if(indexLoc == -1)
            break;
        console.log("contains \' at " + indexLoc);
        givenTitle = givenTitle.substring(0, indexLoc) + "\\" + givenTitle.substring(indexLoc, givenTitle.length);
        index += (indexLoc - index) + 2;
        console.log("next starting " + index);
    } 
    return givenTitle;
}

//Search YouTube API for specified term
function search_execute(){
    const videos_displayed = 25;

    var search_term = document.getElementById("search_term").value;

    return gapi.client.youtube.search.list({
      "part": "snippet",
      "maxResults": videos_displayed,
      "q": search_term,
      "type": "video"
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
                //stores the videos from search list
                const videos = response.result.items;
                displayVideos(videos);
        },
        function(err) { console.error("Execute error", err); });
}
