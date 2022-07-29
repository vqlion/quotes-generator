let prompts = ""
let currentQuote = 0

//gets the json file containing all the prompts
fetch('https://vqlion.me/quotes-generator/prompts.json')
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function (value) {
        prompts = value
        updatePossibleNumber(0)
    })
    .catch(function (err) {
    });

const nameInputs = document.getElementsByClassName("name");

const submitButton = document.getElementById("sub_button");
const validButton = document.getElementById("valid_button");
const checkButton = document.getElementById("check_button")
const promptOutput = document.getElementById("prompt");
const nbPossible = document.getElementById("nb_possible");

const mods = document.getElementsByClassName("check_mod");

mods[0].addEventListener('change', updatePossibleNumber);
mods[1].addEventListener('change', updatePossibleNumber);
mods[2].addEventListener('change', updatePossibleNumber);
submitButton.addEventListener('click', () => {
    generatePrompt()
    updateNameInputs()
});
checkButton.addEventListener('click', showSolution)
validButton.addEventListener('click', checkNames)

//gets and updates the current number of possible quotes, based on the mod and the number of names
function updatePossibleNumber() {
    let count = 0;
    for (let i = 0; i < prompts.length; i++) {
        if (getCurrentMod() === "all") count++; //if the mod is 'all' the tag of the quote doesn't matter
        else if (prompts[i]["tag"] === getCurrentMod()) count++;
    }
    nbPossible.innerText = count + " possible quotes";
}

//updates the number of text areas you can modify based on the given number of names
function updateNameInputs() {
    let nb = prompts[currentQuote]["quantity"]
    for (let i = 0; i < nameInputs.length; i++) {
        nameInputs[i].style.backgroundColor = "";
        nameInputs[i].value = "";
        nameInputs[i].readOnly = true;
        if (i < nb) {
            nameInputs[i].readOnly = false;
        }
    }
}

//generates a random prompt
function generatePrompt() {
    let names = ["(1)", "(2)", "(3)", "(4)"]
    let rand = getRandomInt(prompts.length);
    let validMod = checkMod(rand);
    while (!validMod) {
        rand = getRandomInt(prompts.length);
        validMod = checkMod(rand);
    }
    currentQuote = rand
    promptOutput.innerText = generateText(names, rand);
}

//checks if the input names are the ones from the quote
function checkNames() {
    let names = getNamesFromInputs(prompts[currentQuote]["quantity"])
    let count = 0
    for (let i = 0; i < names.length; i++) {
        if (names[i].toUpperCase() === prompts[currentQuote]["names"][i].toUpperCase()) {
            nameInputs[i].style.backgroundColor = '#78ff78';
            count++
        } else {
            nameInputs[i].style.backgroundColor = '#fa4141';
        }
    }
    if (count == prompts[currentQuote]["quantity"]) showSolution()
}

//shows the correct names for the current quote, both on the prompt and in the text areas 
function showSolution() {
    promptOutput.innerText = generateText(prompts[currentQuote]['names'], currentQuote);
    for (let i = 0; i < prompts[currentQuote]['names'].length; i++) {
        nameInputs[i].value = prompts[currentQuote]['names'][i];
        nameInputs[i].style.backgroundColor = '#78ff78';
    }
}