<script>
    export let link;
    export let name;
    export let isDropDownList=false;

    function Redirect(){
        if(isDropDownList == true){
            window.location.href = link
        }
    }
</script>


<div on:click = {Redirect}>
    {name}
    {#if isDropDownList}
        <nav>
            <slot></slot>
        </nav>
    {/if}
</div>

<style>
    nav{
        position:relative;
        display: none;
        height: 40px;
        width: 150px;
        text-align: center;
        color: black;
    }
    nav:hover{
        display: block;
    }
    div{
        height: 40px;
        width: 150px;
        text-align: center;
    }
    div:hover{
        background-color: white;
        color: black;
    }
    div:hover > nav{
        display: block;
    }
</style>