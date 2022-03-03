<script>
    export let width = "100%";
</script>

<style>
    div{
        background-color: bisque;
        height: 42px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
</style>

<div class="head-container" style="width: {width};">
    <slot />
</div>