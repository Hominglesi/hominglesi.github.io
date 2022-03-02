<script>

</script>

<style>
    div{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: min-content;
        padding: 0 15px;
    }

    div:hover{
        background-color: antiquewhite;
    }

    :global(.head-button-container > h1){
        font-size: 24px;
    }

</style>

<div class="head-button-container">
    <slot />
</div>