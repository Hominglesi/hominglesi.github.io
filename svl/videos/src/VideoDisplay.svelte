<script>   
    let paused = true;
    let bigState = {width: "560px", height: "315px", margin: "0 20px"}
    let smallState = {width: "400px", height: "225px", margin: "0 80px"}
    let video;

    function handleMousedown(e){
        if(video == undefined) video = e.target;

        if (paused){
            video.muted = false;
            video.play();
            video.animate([smallState,bigState],{duration : 250,fill:"forwards"});
        }else{
            video.muted = true;
            setTimeout(() => {endVideo()}, 150);
            
            e.target.animate([bigState,smallState],{duration : 250,fill:"forwards"});
        }
    }

    function endVideo(){
        video.pause();
        video.currentTime = 0;
        video.load();
        paused = true;
    }
</script>

<style>
    video{
        width: 400px;
        height: 225px;
        margin: 0 80px;
        clip-path: polygon(0 0, 94.5% 0, 100% 10%, 100% 100%, 5.5% 100%, 0 90%);;
    }
</style>

<video
    poster="./content/covers/narodni_valorant.jpg"
    src = "./content/videos/kise_jesenje.mp4"
    on:mousedown={handleMousedown}
    bind:paused>
    <track kind="captions">
</video>