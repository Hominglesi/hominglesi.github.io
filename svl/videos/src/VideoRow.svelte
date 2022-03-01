<script>
    import VideoDisplay from "./VideoDisplay.svelte";
    export let name;
    export let cover_src;
    export let video_src;
    export let link;
    //export let playlists;
</script>


<style>
    div{
        background-color: aqua;
        width: 100%;
        height: 360px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
</style>

<div>
    <VideoDisplay cover_src={cover_src} video_src={video_src} />
    <a href={link}><h1>{name}</h1></a>
</div>