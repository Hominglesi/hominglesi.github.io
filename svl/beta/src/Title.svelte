<script>
    export let text = "none";
    export let fontSize = "32px";
    export let fontFamily = "Sofia, Helvetica, sans-serif";

    import './fonts.css';
</script>

<style>
    h1{
        text-align: center;
        width: 100%;
    }
</style>

<h1 style="font-size: {fontSize}; font-family: {fontFamily};">{text}</h1>