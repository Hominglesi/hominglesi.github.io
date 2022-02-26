<script>
    export let link;
    export let name;
    export let isDropDownList=false;

</script>

{#if isDropDownList}
    <div class="ddl">
        <slot></slot>
    </div>
{/if}
<div class="nddl" on:click = {window.location.href = link}>
    {name}
</div>

<style>
    .ddl{
        position:absolute;
        top: 20px;
        display: none;
        height: 40px;
        width: 150px;
        text-align: center;
        color: white;
    }
    .ddl:hover{
        display: block;
    }
    .nddl{
        height: 40px;
        width: 150px;
        text-align: center;
    }
    .nddl:hover{
        background-color: white;
        color: black;
    }
    .nddl:hover .ddl{
        display: block;
    }
</style>