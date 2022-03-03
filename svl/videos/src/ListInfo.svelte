<script>
    export let isHighlighted;
    export let name;
    export let link;
    export let playlists;
    export let date;
    export let lengthDisplay;
</script>

<style>
    .list-info-container{
        background-color: aquamarine;
        height: 200px;
        margin-top: 20px;
    }

    h1, h2{
        padding: 0;
        margin: 0;
    }
</style>

<div class="list-info-container">
    <a href={link}><h1>{name}</h1></a>
    <h2>{playlists}</h2>
    <h2>{date.toLocaleDateString("en-US")}</h2>
    <h2>{lengthDisplay}</h2>

</div>
