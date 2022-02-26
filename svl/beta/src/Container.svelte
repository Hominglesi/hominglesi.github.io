<script>
    export let width = "100%";
    export let height = "100%";
    export let flexDirection = "row";


</script>

<style>
    div{
        display: flex;       
    }

</style>

<div style="width: {width}; height:{height}; flex-direction:{flexDirection};"><slot></slot></div>