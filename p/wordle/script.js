var currentWord = [];

function ClickedLetter(letter, dom){
    if(currentWord.length<5){
        SetButtonStatus(document.getElementById(letter + "-letter"), "green");
        currentWord.push(letter.toUpperCase());
    }
}

function RemoveLetter(){
    if(currentWord.length>0){
        currentWord.pop();
    }
}

function EnterWord(){
    if(currentWord.length==5){
        console.log(currentWord);
        currentWord = [];
    }
}

function SetButtonStatus(button, status){
    button.classList.toggle("letter-button-not-clicked", status=="not-clicked");
    button.classList.toggle("letter-button-not-have", status=="not-have");
    button.classList.toggle("letter-button-green", status=="green");
    button.classList.toggle("letter-button-yellow", status=="yellow");
}