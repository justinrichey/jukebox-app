// 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;
    var display_container = document.getElementById("display_container");
    var isVideoPlaying = true; //Keeps track of whether video is playing; ignores user pauses

    //Finds the youtube video and creates an iframe
    function getYouTube(vidID, nextSong) {
        //Case where there are no videos
        if(vidID == NO_VIDEO){
            display_container.innerHTML = `No songs in queue.`;
            //If player has been created, stop the video
            if (player) {
                stopVideo();
            }
            isVideoPlaying = false;
            return;
        }
        isVideoPlaying = true;
        display_container.textContent = `Currently Playing...`;
        //New song, so create a new iframe
        if(!nextSong){
            console.log("test"+ vidID);
            
            player = new YT.Player('player', {
                height: '390',
                width: '640',
                videoId: vidID,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        } else { //Load the next song
            player.loadVideoById({'videoId': vidID, 'startSeconds': 0});
        }
    }

    // Called when video is ready
    function onPlayerReady(event) {
        event.target.playVideo();
    }

    var done = false;

    // Called when video's state changes
    function onPlayerStateChange(event) {
        if(event.data == YT.PlayerState.ENDED){
            //This is very roundabout right now due to async calls, it first goes to database to grab id then comes back to display id in getYouTube method
            next_song();
        }
    }

    // Called when you stop a video
    function stopVideo() {
        player.stopVideo();
    }
