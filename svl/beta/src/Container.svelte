<script>
    export let width = "auto";
    export let height = "auto";
    export let flexDirection = "row";
    export let margin = "0";
    export let flexGrow = "0";
    export let alignItems = "auto";
    export let backgroundColor = "";
    export let padding = "0";
    export let gap = "0";

</script>

<style>
    div{
        display: flex;     
        margin: 0;
        padding: 0;
    }

</style>

<div style="min-width: {width}; max-width: {width}; height:{height}; flex-direction:{flexDirection}; margin:{margin}; flex-grow:{flexGrow}; align-items:{alignItems}; background-color:{backgroundColor}; padding: {padding}; gap: {gap};"><slot></slot></div>