<script>
    export let text;
    function GoTop(){
        window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
        });
    }

let Scroll = function(){
  if (window.scrollY > 0) {
    document.getElementById("gas").style.display="flex";
  } 
  else {
    document.getElementById("gas").style.display="none";
  }
};

window.addEventListener("scroll", Scroll);
    
</script>

<div id="gas" on:click={GoTop}>
    {text}
</div>

<style>   
    div{
        position: fixed;
        bottom: 10px;
        right: 50px;
        background-color: rgba(0, 0, 0, 0.25);
        border-radius: 50%;
        height: 50px;
        width: 50px;
        display: none;
        align-items: center;
        justify-content: center;
    }
    div:hover{
        background-color: rgba(0, 0, 0, 0.5);
        cursor: pointer;
    }
</style>