<script>
    import VideoDisplay from "./VideoDisplay.svelte";
    import { currentHighlighted } from './stores.js';
    export let name;
    export let cover_src;
    export let video_src;
    export let link;
    //export let playlists;

    let bigState = {padding: "60px 0"}
    let smallState = {padding: "0 0"}

    let container;

    let lastHighlighted;
    $: isHighlighted = $currentHighlighted?.id == cover_src+video_src;
    $: {if(isHighlighted != lastHighlighted){
            highlightUpdated();
        } 
        lastHighlighted = isHighlighted;
    }

    function highlightUpdated(){
        if(container != undefined)
        if(isHighlighted){
            container.animate([smallState,bigState],{duration : 250,fill:"forwards"});
        }else{
            container.animate([bigState,smallState],{duration : 250,fill:"forwards"});
        }
    }
</script>


<style>
    div{
        background-color: aqua;
        width: 100%;
        height: 300px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
</style>

<div bind:this={container}>
    <VideoDisplay cover_src={cover_src} video_src={video_src} />
    <a href={link}><h1>{name}</h1></a>
</div>