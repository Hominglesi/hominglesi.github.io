<script>
    export let title;
    export let date;
    export let content;
</script>

<style>
    h2{
        border-top: 2px solid red;
        font-size: 32px;
        font-family: "Quantico",sans-serif;
        color: black;
        margin: 0;
        padding-left: 10px;
        padding-top: 2px;
    }
    h3{
        font-size: 12px;
        margin: 2px 26px;
        color: gray;
        font-family: "Quantico",sans-serif;
    }
    :global(.blogPostContent > h1){
        font-family: "Quantico",sans-serif;
        font-size: 16px;
        color: gray;
    }
    :global(.blogPostContent > a){
        font-family: "Quantico",sans-serif;
        font-size: 16px;
        color: rgb(122, 26, 21);
        font-weight: bold;
        text-decoration: none;
    }
    :global(.blogPostContent > h1 > a){
        font-family: "Quantico",sans-serif;
        font-size: 16px;
        color: rgb(122, 26, 21);
        text-decoration: none;
    }
</style>

<div>
    <h2>{title}</h2>
    <h3>{date}</h3>
    <p class="blogPostContent">{@html content}</p>
</div>

