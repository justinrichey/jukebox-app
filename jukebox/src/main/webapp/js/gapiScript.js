var API_KEY = "AIzaSyBTz_m7PhhcCWy1RxbMb1O24ItNAoRN6S0";


gapi.load("client:auth2", function() { });

//Load API
function loadClient() {
gapi.client.setApiKey(API_KEY);
    gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
                function(err) { console.error("Error loading GAPI client for API", err); });
    

}

// function start_queue(){
//     //display video
//     const room_ID = 1; //parse thru url later, hardcoded for now
//     var display_container = document.getElementById("display_container");
//     curr_vid(room_ID).then( function(song) {
//     console.log(song);
//     var display =` 
//         <iframe width="420" height="315"src="https://www.youtube.com/embed/${song}"></iframe>
//     `;
//     display_container.innerHTML = display;// curr_vid(room_ID);
//     });
// }