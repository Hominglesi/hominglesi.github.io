<script>
    export let isLabel = false;

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function handleClick(){
        dispatch('click', {});
    }
</script>

<style>
    div{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 72%;
        border-radius: 6px;
        width: fit-content;
        padding: 0 12px;
        margin: 2px 2px;
        line-height: 1;
    }

    .head-button:hover{
        background-color: salmon;
    }

    :global(.head-button-container > h1){
        font-size: 20px;
    }

</style>

<div class="head-button-container {isLabel == false ? "head-button" : ""}" on:click={handleClick}>
    <slot />
</div>