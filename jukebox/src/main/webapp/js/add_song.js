var CLIENT_ID = "2440856049-ga26c9i6ijv84jsedvc0ddsqi1bk1ftd.apps.googleusercontent.com";
var API_KEY = "AIzaSyBTz_m7PhhcCWy1RxbMb1O24ItNAoRN6S0";


// Displays a list of videos resulting from search
function displayVideos(videos){
    //parse through data, create a list with the title being clickable leading to youtube video, and a button
    var result_container = document.getElementById("result_container");
    if(videos.length > 0){
        let output = `<h4>Search Results</h4>`;
        //Loop through videos and append to output
        videos.forEach(vid =>{
            const vid_title = checkSpecial(vid.snippet.title);
            const vid_ID = vid.id.videoId;
            //TODO - Update to ul/li in the future to clean design, button onclick does not work(maybe use ids and send val from id in addSong)
            output += `
                <div>
                    <a href=https://www.youtube.com/watch?v=${vid_ID}>${vid.snippet.title}</a>
                    <button type="button" onclick="addSongToDB('${vid_ID}', '${vid_title}')">Add Song to Queue</button>
                </div>
            `;
        })
        result_container.innerHTML = output;
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
