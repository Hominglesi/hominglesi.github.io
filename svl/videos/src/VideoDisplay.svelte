<script>   
    export let cover_src;
    export let video_src;
    import { currentHighlighted } from './stores.js';

    let paused = true;
    let ended;
    let bigState = {width: "640px", height: "360px"}
    let smallState = {width: "400px", height: "225px"}
    let video;

    $: if(ended == true){
        endVideo();
        $currentHighlighted = undefined;
    }
    
    $: if(paused == false && $currentHighlighted?.id != cover_src+video_src){
        endVideo();
    }

    function handleMousedown(e){
        if(paused == true){
            if($currentHighlighted != video)
                $currentHighlighted = video;

            playVideo()
        }else{
            if($currentHighlighted == video)
                $currentHighlighted = undefined;

            endVideo()
        }
    }

    function playVideo(){
        video.muted = false;
            video.play();
            video.animate([smallState,bigState],{duration : 220,fill:"forwards"});
    }

    function endVideo(){
        video.muted = true;
        video.animate([bigState,smallState],{duration : 220,fill:"forwards"});

        setTimeout(() => {
            video.pause();
            video.currentTime = 0;
            video.load();
            paused = true;
        }, 150);
    }
</script>

<style>
    video{
        width: 400px;
        height: 225px;
        clip-path: polygon(0 0, 94.5% 0, 100% 10%, 100% 100%, 5.5% 100%, 0 90%);
        display: block;
    }
    div{
        background-color: var(--c-accent2);
        margin: 0 20px;
        height: min-content;
        padding: 4px;
        clip-path: polygon(0 0, 94.5% 0, 100% 10%, 100% 100%, 5.5% 100%, 0 90%);
    }
</style>

<div>
    <video
    id={cover_src+video_src}
    poster="https://hominglesi.github.io/storage/covers/{cover_src}"
    src = "https://hominglesi.github.io/storage/previews/{video_src}"
    bind:this={video}
    on:mousedown={handleMousedown}
    bind:ended
    bind:paused>
    <track kind="captions">
    </video>
</div>
