var API_KEY = "hidden";


gapi.load("client:auth2", function() { });

//Load API
function loadClient() {
gapi.client.setApiKey(API_KEY);
    gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
                function(err) { console.error("Error loading GAPI client for API", err); });
    

}
