<script>
    export let text;
    export let link;
</script>

<div on:click={window.location.href = link}>
    {text}
</div>


<style>
    div{
        border: 2px solid black;
        width: 350px;
        padding-top: 8px;
        padding-bottom: 8px;
        font-size: 32px;
        color: black;
        text-align: center;
        cursor:pointer;
    }
    div:hover{
        background-color: black;
        color: white;

    }
</style>
