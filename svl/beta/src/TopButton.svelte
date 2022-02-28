<script>
    export let text;
    let status="true";
    function GoTop(){
        window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
        });
    }

let Scroll = function(){
  let y = window.scrollY;
  if (y > 0 && status=="true") {
    document.getElementById("gas").style.display="flex";
    document.getElementById("gas").animate([{opacity:0},{opacity:1}],{duration : 500,fill:"forwards"});
    document.getElementById("gas").style.cursor="pointer";
    status="false";
  } 
  else if (y==0 && status=="false"){
    document.getElementById("gas").style.display="flex";
    document.getElementById("gas").animate([{opacity:1},{opacity:0}],{duration : 500,fill:"forwards"});
    document.getElementById("gas").style.cursor="default";
    status="true";
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
        font-size: 34px;
    }

    div:hover{
        background-color: rgba(0, 0, 0, 0.5);
    }
</style>