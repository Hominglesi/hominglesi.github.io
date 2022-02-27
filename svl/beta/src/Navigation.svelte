<script>
    export let link;
    export let name;
    export let isDropDownList=false;

    function Redirect(){
        if(isDropDownList == false){
            window.location.href = link
        }
    }
</script>


<div class="nav-item" on:click = {Redirect}>
    {name}
    {#if isDropDownList}
        <nav class="nav-container">
            <slot></slot>
        </nav>
    {/if}
</div>

<style>
    nav{
        position:relative;
        display: none;
        width: 150px;
        text-align: center;
        color: black;
        background-color: white;
    }
    nav:hover{
        display: block;
    }
    div{
        height: 40px;
        width: 150px;
        text-align: center;
        color: white;
        font-family: 'Times New Roman', Times, serif;
        font-size: 32px;
    }
    div:hover{
        background-color: white;
        color: black;
        cursor: pointer;
    }
    div:hover > nav{
        display: block;
    }
    :global(.nav-container > div > .nav-item){
        background-color: white;
        color: black; 
        border-top: 1px solid black;    
        font-size:24px ; 
        display: flex;
        align-items: center;
        justify-content: center;
    }
    :global(.nav-container > div > .nav-item:hover){
        background-color: black;
        color: white;
    }

</style>