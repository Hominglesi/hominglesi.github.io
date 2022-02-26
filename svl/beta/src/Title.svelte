<script>
    export let text = "none";
    export let fontSize = "32px";
    export let fontFamily = "Ariel, Helvetica, sans-serif";
    export let color = "black";
    export let margin = "0";

</script>

<style>
    h1{
        text-align: center;
        width: 100%;
        margin: 0;
    }
</style>

<h1 style="font-size: {fontSize}; font-family: {fontFamily}; color: {color}; margin: {margin};">{text}</h1>