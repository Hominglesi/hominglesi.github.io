<script>
    export let width = "auto";
    export let height = "auto";
    export let flexDirection = "row";
    export let margin = "0";
    export let flexGrow = "0";
    export let alignItems = "auto";


</script>

<style>
    div{
        display: flex;     
        margin: 0;
        padding: 0;
    }

</style>

<div style="width: {width}; height:{height}; flex-direction:{flexDirection}; margin:{margin}; flex-grow:{flexGrow}; align-items:{alignItems}"><slot></slot></div>