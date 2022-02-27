<script>
    export let text;
    export let link;
</script>

<div on:click={window.location.href = link}>
    <h1>{text}</h1>
</div>


<style>
    div{
        border: 3px solid black;
        width: 350px;
        padding-top: 8px;
        padding-bottom: 8px;
        
        
        text-align: center;
        cursor:pointer;
        

        background: linear-gradient(100deg, black 50%, transparent 50%);
        background-size: 210% 100%;
        background-position: right bottom;
        transition: all 0.2s cubic-bezier(0.46, 1, 0.58, 1);
    }
    div:hover{
        background-position: left bottom;
    }
    div:hover > h1{
        transform: translateX(3%);
        color: white;
    }

    h1{
        transition: all 0.1s linear; 
        font-size: 32px;
        margin: 0;
        padding: 0;
        font-family: "Times New Roman", sans-serif;
        font-weight: normal;
        color: black;
    }
</style>
