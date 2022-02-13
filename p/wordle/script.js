var currentWord = [];
var currentRow = -1;

var targetWord = ["B","L","O","C","K"]

CreateNextRow();
//SetButtonStatus(document.getElementById(letter + "-letter"), "green");

function ClickedLetter(letter, dom){
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
    if(currentWord.length==5){
        console.log(currentWord);
        CreateNextRow();
        currentWord = [];
    }
}

function SetButtonStatus(button, status){
    button.classList.toggle("letter-button-not-clicked", status=="not-clicked");
    button.classList.toggle("letter-button-not-have", status=="not-have");
    button.classList.toggle("letter-button-green", status=="green");
    button.classList.toggle("letter-button-yellow", status=="yellow");
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

function CreateNextRow(){
    currentRow++;
    var letterboxContainer = document.getElementsByClassName("letterbox-container")[0];
    var letterboxRow = CreateElement("div","letterbox-row","letterbox-row-" + currentRow, letterboxContainer);
    for (let i = 0; i < 5; i++) {
        CreateElement("h1","letterbox", "letterbox-" + currentRow + "-" + i, letterboxRow);
    }
}

function CreateElement(divType, divClass, divId, parent){
    var div = document.createElement(divType);
    div.classList.add(divClass);
    div.id = divId;
    parent.appendChild(div);

    return div;
}