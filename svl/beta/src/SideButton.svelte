<script>
    export let text;
    export let link;
</script>

<div on:click={window.location.href = link}>
    {text}
</div>


<style>
    div{
        border: 3px solid black;
        width: 350px;
        padding-top: 8px;
        padding-bottom: 8px;
        font-size: 32px;
        color: black;
        text-align: center;
        cursor:pointer;
        font-family: "Times New Roman", sans-serif;
    }
    div:hover{
        background-color: black;
        color: white;

    }
</style>
