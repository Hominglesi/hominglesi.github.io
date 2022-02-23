var currentWord = [];
var currentRow = -1;
var maxPoints = 25;
var players = [];
var currentPlayer = 0;
var pointsPerLetter = 2;
var pointsPerWord = 3;

var targetWord = GetRandomWord();
var guessedLetters = ["x","x","x","x","x"];

var prob1 = 5;
var prob2 = 2;
var prob3 = 1;

function CreatePlayers(){
    var totalChance = 0;
    for (let i = 0; i < matchups.length; i++) {
        totalChance += GetProbability(matchups[i].tier)
    }
    var randomNum = Math.floor(Math.random()*totalChance);
    totalChance = 0;
    var name1;
    var name2;
    for (let i = 0; i < matchups.length; i++) {
        if(totalChance < randomNum){
            totalChance += GetProbability(matchups[i].tier);
        }else{
            name1 = matchups[i].name1;
            name2 = matchups[i].name2;
            i = matchups.length;
        }
    }
    if(name1 == undefined || name2 == undefined){
        console.log("Error moment");
        name1 = "Player1";
        name2 = "Player2";
    }

    new Player(name1);
    new Player(name2);
}

function GetProbability(tier){
    switch (tier) {
        case "common": return prob1;
        case "uncommon": return prob2;
        case "rare": return prob3;
    }
}

CreatePlayers();

CreateNextRow();
//SetButtonStatus(document.getElementById(letter + "-letter"), "green");



function ClickedLetter(letter){
    if(currentWord.length<5){
        
        currentWord.push(letter.toUpperCase());
        UpdateCurrentLetterbox();
    }
}

function RemoveLetter(){
    if(currentWord.length>0){
        currentWord.pop();
        UpdateCurrentLetterbox();
    }
}

function EnterWord(){
    if(currentWord.length!=5) return;
    if(CheckWord(currentWord) == true){
        ValidateRow();
        ProccesWord();
        CreateNextRow();
        currentWord = [];
    }else{
        var dom = document.getElementById("letterbox-row-" + currentRow);
        dom.classList.add("apply-shake")
    }
        
}

function SetButtonStatus(letter, status){
    var button = document.getElementById(letter.toLowerCase() + "-letter");
    button.classList.toggle("letter-button-not-clicked", status=="not-clicked");
    button.classList.toggle("letter-button-not-have", status=="not-have");
    button.classList.toggle("letter-button-green", status=="green");
    button.classList.toggle("letter-button-yellow", status=="yellow");
}

function GetButtonStatus(letter){
    var button = document.getElementById(letter.toLowerCase() + "-letter");
    if(button.classList.contains("letter-button-not-clicked")) return "not-clicked"
    if(button.classList.contains("letter-button-not-have")) return "not-have"
    if(button.classList.contains("letter-button-green")) return "green"
    if(button.classList.contains("letter-button-yellow")) return "yellow"
    return "";
}

function UpdateCurrentLetterbox(){
    for (let i = 0; i < 5; i++) {
        var div = document.getElementById("letterbox-" + currentRow + "-" + i);
        if(currentWord[i] != undefined){
            div.innerText = currentWord[i];
        }
        else(div.innerText = "");
    }
}

function ValidateRow(){
    var remainingWord = targetWord;
    //first pass
    for (let i = 0; i < 5; i++) {
        if(currentWord[i] == remainingWord[i]){
            document.getElementById("letterbox-" + currentRow + "-" + i).classList.add("letterbox-green");
            SetButtonStatus(currentWord[i], "green");
            remainingWord = remainingWord.replaceAt(i, '.');
        }
    }

    //second pass
    for (let i = 0; i < 5; i++) {
        if(document.getElementById("letterbox-" + currentRow + "-" + i).classList.contains("letterbox-green")) continue;
        if(remainingWord.includes(currentWord[i])){
            document.getElementById("letterbox-" + currentRow + "-" + i).classList.add("letterbox-yellow");
            var index = remainingWord.indexOf(currentWord[i]);
            remainingWord = remainingWord.replaceAt(index, '.');
            if(GetButtonStatus(currentWord[i]) != "green")
                SetButtonStatus(currentWord[i], "yellow")
        }
    }

    //third pass
    for (let i = 0; i < 5; i++) {
        if(document.getElementById("letterbox-" + currentRow + "-" + i).classList.contains("letterbox-green")) continue;
        if(document.getElementById("letterbox-" + currentRow + "-" + i).classList.contains("letterbox-yellow")) continue;
        if(currentWord[i] == '.') continue;
        document.getElementById("letterbox-" + currentRow + "-" + i).classList.add("letterbox-gray");
        if(GetButtonStatus(currentWord[i]) == "not-clicked")
            SetButtonStatus(currentWord[i], "not-have")
    }
}

function ProccesWord(){
    var word = currentWord.join("");

    ProcessPlay(word == targetWord);

    if(word == targetWord){
        targetWord = GetRandomWord();
        ResetKeyboard();
    }
}

function ProcessPlay(isGuessed){
    for (let i = 0; i < 5; i++) {
        if(guessedLetters[i]=="o") continue;
        if(currentWord[i] == targetWord[i]){
            players[currentPlayer].addPoints(pointsPerLetter);
            guessedLetters[i]="o";
        }
    }

    if(isGuessed){
        players[currentPlayer].addPoints(pointsPerWord);
        guessedLetters = ["x","x","x","x","x"];
    }

    currentPlayer++;
    if(currentPlayer>=players.length) currentPlayer=0;
    for (let i = 0; i < players.length; i++) {
        players[i].setTurn();
        
    }
}

function ResetKeyboard(){
    var letters = document.getElementsByClassName("letter-button");
    for (let i = 0; i < letters.length; i++) {
        var letter = letters[i];
        var letterChar = letter.id.charAt(0);
        SetButtonStatus(letterChar, "not-clicked");
        
    }
}

function CreateNextRow(){
    currentRow++;
    var letterboxContainer = document.getElementsByClassName("letterbox-container-scrollable")[0];
    var letterboxRow = CreateElement("div","letterbox-row","letterbox-row-" + currentRow, letterboxContainer);
    for (let i = 0; i < 5; i++) {
        var el = CreateElement("h1","letterbox", "letterbox-" + currentRow + "-" + i, letterboxRow);
        el.classList.toggle("letterbox-player1",currentPlayer==0);
        el.classList.toggle("letterbox-player2",currentPlayer==1);
    }

    letterboxRow.addEventListener("animationend", (e) => {
        letterboxRow.classList.remove("apply-shake");
    });

    letterboxContainer.scrollTop = letterboxContainer.scrollHeight;
}

function CreateElement(divType, divClass, divId, parent){
    var div = document.createElement(divType);
    div.classList.add(divClass);
    div.id = divId;
    parent.appendChild(div);

    return div;
}

function CheckWord(word){
    var stringWord = word.join("");
    return acceptedWords.includes(stringWord.toLowerCase());
}

function GetRandomWord(){
    return goodWords[Math.floor(Math.random()*goodWords.length)].toUpperCase();
}

document.addEventListener("keydown", e => {
    if(e.code.startsWith("Key")){
        ClickedLetter(e.code.charAt(3));
    }else if(e.code == "Backspace"){
        RemoveLetter();
    }else if(e.code == "Enter"){
        EnterWord();
    }
});

String.prototype.replaceAt=function(index, char) {
    var a = this.split("");
    a[index] = char;
    return a.join("");
}