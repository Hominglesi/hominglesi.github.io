var currentWord = [];
var currentRow = -1;

var targetWord = goodWords[Math.floor(Math.random()*goodWords.length)].toUpperCase();

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
            if(GetButtonStatus(currentWord[i]) != "green");
                SetButtonStatus(currentWord[i], "yellow")
        }
    }

    //third pass
    for (let i = 0; i < 5; i++) {
        if(document.getElementById("letterbox-" + currentRow + "-" + i).classList.contains("letterbox-green")) continue;
        if(document.getElementById("letterbox-" + currentRow + "-" + i).classList.contains("letterbox-yellow")) continue;
        if(currentWord[i] == '.') continue;
        document.getElementById("letterbox-" + currentRow + "-" + i).classList.add("letterbox-gray");
        if(GetButtonStatus(currentWord[i]) == "not-clicked");
            SetButtonStatus(currentWord[i], "not-have")
    }
}

function CreateNextRow(){
    currentRow++;
    var letterboxContainer = document.getElementsByClassName("letterbox-container")[0];
    var letterboxRow = CreateElement("div","letterbox-row","letterbox-row-" + currentRow, letterboxContainer);
    for (let i = 0; i < 5; i++) {
        CreateElement("h1","letterbox", "letterbox-" + currentRow + "-" + i, letterboxRow);
    }

    letterboxRow.addEventListener("animationend", (e) => {
        letterboxRow.classList.remove("apply-shake");
    });
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