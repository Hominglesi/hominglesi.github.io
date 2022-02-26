<script>
    export let text = "none";
    export let fontSize = "32px";
    export let fontFamily = "Ariel, Helvetica, sans-serif";
    export let color = "black";

</script>

<style>
    h1{
        text-align: center;
        width: 100%;
    }
</style>

<h1 style="font-size: {fontSize}; font-family: {fontFamily}; color: {color};">{text}</h1>