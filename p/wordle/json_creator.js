const fs = require("fs");

var goodFile = __dirname + "/words/5_words_good.txt";
var acceptedFile = __dirname + "/words/5_words.txt";
var goodOutputFile = __dirname + "/goodWords.js";
var acceptedOutputFile = __dirname + "/acceptedWords.js";


var accpetedWords = fs.readFileSync(acceptedFile).toString().split('\n');
accpetedWords = [...new Set(accpetedWords)];
accpetedWords.pop();
var goodWords = fs.readFileSync(goodFile).toString().split('\n');
goodWords = [...new Set(goodWords)];
goodWords.pop();

for (let i = 0; i < accpetedWords.length; i++) {
    accpetedWords[i] = accpetedWords[i].slice(0, -1);
    accpetedWords[i] = '"' + accpetedWords[i] + '"';
}

for (let i = 0; i < goodWords.length; i++) {
    goodWords[i] = goodWords[i].slice(0, -1);
    goodWords[i] = '"' + goodWords[i] + '"';
}

var acceptedWordsText = "var acceptedWords = [" + accpetedWords.join() + "];";
Write(acceptedOutputFile, acceptedWordsText);

var goodWordsText = "var goodWords = [" + goodWords.join() + "];";
Write(goodOutputFile, goodWordsText);


function Write(filepath, line){
    try {
        fs.writeFileSync(filepath, line, { flag: 'w+' })
    } catch (err) {
        console.error(err)
    }
}