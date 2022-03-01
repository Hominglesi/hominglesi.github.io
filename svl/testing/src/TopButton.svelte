<script>
    import { fade } from 'svelte/transition';

    let currentHeight;
    $: isVisible = currentHeight > 0;
    window.addEventListener("scroll", () => { currentHeight = window.scrollY; });

    function GoTop() {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };
</script>

{#if isVisible}
    <div transition:fade="{{duration: 200}}" id="top-control" on:click={GoTop}>
        <slot/>
    </div>
{/if}


<style>   
    div{
        display: flex;
        position: fixed;
        bottom: 30px;
        right: 45px;
        background-color: rgba(0, 0, 0, 0.25);
        border-radius: 50%;
        height: 50px;
        width: 50px;
        align-items: center;
        justify-content: center;
        font-size: 34px;
        color: rgb(155, 196, 219);
        transition: all 0.2s;
    }

    div:hover{
        background-color: rgba(0, 0, 0, 0.5);
    }
</style>