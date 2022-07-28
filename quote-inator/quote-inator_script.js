let prompts = ""
let currentQuote = 0

//gets the json file containing all the prompts
fetch('quotes-generator/prompts.json')
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
        if (getCurrentMod() === "all") count++;
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

//gets the current mod 
function getCurrentMod() {
    if (mods[2].checked || (mods[0].checked && mods[1].checked) || (!mods[0].checked && !mods[1].checked && !mods[2].checked)) return "all";
    else if (mods[0].checked) return "wtsmp";
    else if (mods[1].checked) return "bir";
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

//generates the text of the prompt
function generateText(names, rand) {
    let temp = "";
    for (let i = 0; i < prompts[rand]["lines"].length; i++) {
        temp += names[prompts[rand]["lines"][i]["person"]] + " : ";
        let content = prompts[rand]["lines"][i]["text"];
        if (prompts[rand]["lines"][i].hasOwnProperty("integs")) {
            content = addIntegratedText(names, rand, content, i);
        }
        temp += content;
        temp += "\n";
    }
    return temp;
}

//adds integrated text (names inside of a quote) to the prompt's text
function addIntegratedText(names, rand, content, i) {
    let offset = 0;
    for (let j = 0; j < prompts[rand]["lines"][i]["integs"].length; j++) {
        content = insertIntoString(content, names[prompts[rand]["lines"][i]["integs"][j]["person"]], prompts[rand]["lines"][i]["integs"][j]["value"] + offset);
        offset += names[prompts[rand]["lines"][i]["integs"][j]["person"]].length; //offset is for multiple integrations 
    }
    return content;
}

//checks if the input names are the ones from the quote
function checkNames() {
    let names = getNamesFromInputs(prompts[currentQuote]["quantity"])
    let count = 0
    for(let i = 0; i < names.length; i++) {
        if(names[i].toUpperCase() === prompts[currentQuote]["names"][i].toUpperCase()) {
            nameInputs[i].style.backgroundColor = '#78ff78';
            count++
        } else {
            nameInputs[i].style.backgroundColor = '#fa4141';
        }
    }
    if(count == prompts[currentQuote]["quantity"]) showSolution()
}

function showSolution() {
    promptOutput.innerText = generateText(prompts[currentQuote]['names'], currentQuote);
    for(let i = 0; i < prompts[currentQuote]['names'].length; i++) {
        nameInputs[i].value = prompts[currentQuote]['names'][i];
        nameInputs[i].style.backgroundColor = '#78ff78';
    }
}

//gets the names from the text areas
function getNamesFromInputs(nb) {
    let temp = [];
    for (let i = 0; i < nb; i++) {
        temp[i] = nameInputs[i].value;
    }
    return temp;
}

//returns true if the selected quote (of index rand) is conform with the current mod, false otherwise
function checkMod(rand) {
    return mods[2].checked || (mods[0].checked && mods[1].checked) || (mods[1].checked && prompts[rand]["tag"] === "bir") || (mods[0].checked && prompts[rand]["tag"] === "wtsmp") || (!mods[0].checked && !mods[1].checked && !mods[2].checked);
}

//returns a random int between 0 and max
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

//inserts a string into a string at a given position
function insertIntoString(str, ins, pos) {
    return [str.slice(0, pos), ins, str.slice(pos)].join('');
}