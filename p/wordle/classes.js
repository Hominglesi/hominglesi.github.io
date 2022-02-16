class Player{
    constructor(){
        players.push(this);
        this.points = 0;
        this.createBar();

        this.setPoints(Math.floor(Math.random()*25));
    }

    createBar(){
        var outerBar = CreateElement("div","outer-bar","",document.getElementsByClassName("letterbox-container-top")[0]);
        this.innerBar = CreateElement("div","inner-bar","",outerBar);
        this.extraBar = CreateElement("div","extra-bar","",outerBar);
    }

    setPoints(newPoints){
        this.points = newPoints;
        this.innerBar.style.width = newPoints / maxPoints * 100 + "%";
        if(newPoints>maxPoints){
            this.extraBar.style.width = (newPoints - maxPoints) / maxPoints * 100 + "%";
        }else{
            this.extraBar.style.width = "0";
        }
    }
}