class Player{
    constructor(name){
        this.playerNumber = players.length;
        players.push(this);
        this.name = name;
        this.points = 0;
        this.createBar();

        this.setPoints(0);
        this.setTurn();
    }

    createBar(){
        this.nameDiv = CreateElement("div","player-name","",document.getElementsByClassName("letterbox-container-top")[0]);
        this.nameDiv.innerText = this.name;
        this.nameDiv.classList.toggle("playername1", this.playerNumber == 0);
        this.nameDiv.classList.toggle("playername2", this.playerNumber == 1);

        this.outerBar = CreateElement("div","outer-bar","",document.getElementsByClassName("letterbox-container-top")[0]);
        this.innerBar = CreateElement("div","inner-bar","",this.outerBar);
        this.extraBar = CreateElement("div","extra-bar","",this.outerBar);
        this.outerBar.classList.toggle("playerbar1", this.playerNumber == 0);
        this.outerBar.classList.toggle("playerbar2", this.playerNumber == 1);
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

    addPoints(toAdd){
        this.setPoints(this.points+toAdd);
    }

    setTurn(){
        /*
        this.outerBar.classList.toggle("player-bar-active", currentPlayer == this.playerNumber);
        this.outerBar.classList.toggle("player-bar-idle", currentPlayer != this.playerNumber);*/
        /*
        this.nameDiv.classList.toggle("player-name-active", currentPlayer == this.playerNumber);
        this.nameDiv.classList.toggle("player-name-idle", currentPlayer != this.playerNumber);*/
    }
}