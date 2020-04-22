var CLIENT_ID = "2440856049-ga26c9i6ijv84jsedvc0ddsqi1bk1ftd.apps.googleusercontent.com";
var API_KEY = "AIzaSyBTz_m7PhhcCWy1RxbMb1O24ItNAoRN6S0";
// gapi.auth2.init({client_id: "2440856049-ga26c9i6ijv84jsedvc0ddsqi1bk1ftd.apps.googleusercontent.com"});

//Implements 2Oauth
// function authenticate() {
// return gapi.auth2.getAuthInstance(CLIENT_ID)
//     .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
//     .then(function() { console.log("Sign-in successful"); },
//             function(err) { console.error("Error signing in", err); });
// }

//Loads the API key to use YouTube Data API
function loadClient() {
gapi.client.setApiKey(API_KEY);
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
                function(err) { console.error("Error loading GAPI client for API", err); });
}

//This has no functionality
function addSong(song, title){
    const ROOM_ID = 1;
    console.log("added song!");
    add_new_song(song, title,ROOM_ID); //in dbScript.js
}

// Displays a list of videos resulting from search
function displayVideos(videos){
    //parse through data, create a list with the title being clickable leading to youtube video, and a button
    var video_container = document.getElementById("video_container");
    console.log("I've found " + videos.length + " videos!");
    if(videos.length > 0){
        let output = `<h4>Search Results</h4>`;

        //Loop through videos and append to output
        videos.forEach(vid =>{
            const vid_title = vid.snippet.title;
            const vid_ID = vid.id.videoId;
            //TODO - Update to ul/li in the future to clean design, button onclick does not work(maybe use ids and send val from id in addSong)
            output += `
                <div>
                    <a href=https://www.youtube.com/watch?v=${vid_ID}>${vid_title}</a>
                    <button type="button" onclick="addSong('${vid_ID}', '${vid_title}')">Add Song to Queue</button>
                </div>
            `;
        })
        video_container.innerHTML = output;
    } else {
        video_container.innerHTML = `No Videos Found`;
    }
}

//Search YouTube API for specified term
function search_execute(){
    const videos_displayed = 25;

    var search_term = document.getElementById("search_term").value; //TODO - could be passed
    console.log("Searched for " + search_term);

    return gapi.client.youtube.search.list({
      "part": "snippet",
      "maxResults": videos_displayed,
      "q": search_term
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
