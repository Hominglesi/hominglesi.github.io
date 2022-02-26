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


<div on:click = {Redirect}>
    {name}
    {#if isDropDownList}
        <nav class="nav-item">
            <slot></slot>
        </nav>
    {/if}
</div>

<style>
    nav{
        position:relative;
        top:19px;
        display: none;
        width: 150px;
        text-align: center;
        color: black;
        border: 1px black solid;
        background-color: white;
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
        cursor: pointer;
    }
    div:hover > nav{
        display: block;
    }
</style>