<script>
    let isAtTop=true;
    function GoTop() {
        window.scrollTo({top: 600, behavior: 'smooth'});
    };
        
    window.addEventListener("scroll", () => {
      let y = window.scrollY;
      if (y > 600 && isAtTop==true) {
        document.getElementById("top-control").style.display="flex";
        document.getElementById("top-control").animate([{opacity:0},{opacity:1}],{duration : 200,fill:"forwards"});
        document.getElementById("top-control").style.cursor="pointer";
        isAtTop=false;
      } 
      else if (y==0 && isAtTop==false){
        document.getElementById("top-control").style.display="flex";
        document.getElementById("top-control").animate([{opacity:1},{opacity:0}],{duration : 200,fill:"forwards"});
        document.getElementById("top-control").style.cursor="default";
        isAtTop=true;
    }});
    
</script>

<div id="top-control" on:click={GoTop}>
    <slot/>
</div>

<style>   
    div{
        position: fixed;
        bottom: 30px;
        right: 45px;
        background-color: var(--c-accent3b);
        border-radius: 50%;
        height: 50px;
        width: 50px;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 34px;
        color: var(--c-accent2);
        transition: all 0.2s;
    }

    div:hover{
        background-color: var(--c-accent3);
    }
</style>