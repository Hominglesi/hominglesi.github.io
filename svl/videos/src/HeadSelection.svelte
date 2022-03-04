<script>
    export let width = "100%";
</script>

<style>
    div{
        background-color: var(--c-accent2);
        height: 42px;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 16px;
        border-radius: 0 0 20px 20px;
    }
</style>

<div class="head-container" style="width: {width};">
    <slot />
</div>