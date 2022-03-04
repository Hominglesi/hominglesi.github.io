<script>
    import VideoDisplay from "./VideoDisplay.svelte";
    import { currentHighlighted } from './stores.js';
    import Container from "./Container.svelte";
    import ListInfo from "./ListInfo.svelte";
    
    export let name;
    export let cover_src;
    export let video_src;
    export let link;
    export let playlists;
    export let date;
    export let length;
    export let lengthDisplay;
    export let isFliped = false;

    let bigState = {}
    let smallState = {}

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
        
        width: 100%;
        display: flex;
        padding: 16px 0;
        flex-direction: row;
        align-items: center;
    }

</style>

<div bind:this={container}>
        {#if isFliped == false}
            <Container width="fit-content">
                <VideoDisplay {cover_src} {video_src}/>
            </Container>
            <Container flexGrow="1" >
                <ListInfo {isHighlighted} {name} {link} {playlists} {date} {lengthDisplay} />
            </Container>
        {:else}
            <Container flexGrow="1" flexDirection="row-reverse" >
                <ListInfo {isHighlighted} {name} {link} {playlists} {date} {lengthDisplay} {isFliped} />
            </Container>
            <Container width="fit-content">
                <VideoDisplay {cover_src} {video_src} />
            </Container>
        {/if}
</div>