let prompts = ""

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
const nbChar = document.getElementById("nb_char");

const submitButton = document.getElementById("sub_button");
const promptOutput = document.getElementById("prompt");
const nbPossible = document.getElementById("nb_possible");

const mods = document.getElementsByClassName("check_mod");

updateNameInputs(0);
nbChar.addEventListener('change', () => {
    updateNameInputs();
    updatePossibleNumber();
});
mods[0].addEventListener('change', updatePossibleNumber);
mods[1].addEventListener('change', updatePossibleNumber);
mods[2].addEventListener('change', updatePossibleNumber);
submitButton.addEventListener('click', generatePrompt);

//updates the number of text areas you can modify based on the given number of names
function updateNameInputs() {
    let nb = parseFloat(nbChar.value);
    for (let i = 0; i < nameInputs.length; i++) {
        nameInputs[i].readOnly = true;
        if (i < nb) {
            nameInputs[i].readOnly = false;
        }
    }
}

//generates a certain prompt
function testPrompts() {
    let promptNumber = 9
    let names = getNamesFromInputs(4);
    promptOutput.innerText = generateText(names, promptNumber);
}

//gets and updates the current number of possible quotes, based on the mod and the number of names
function updatePossibleNumber() {
    let nb = parseFloat(nbChar.value);
    let count = 0;
    for (let i = 0; i < prompts.length; i++) {
        if (prompts[i]["quantity"] === nb && getCurrentMod() === "all") count++;
        else if (prompts[i]["quantity"] === nb && prompts[i]["tag"] === getCurrentMod()) count++;
    }
    nbPossible.innerText = count + " possible quotes";
}

//generates a random prompt
function generatePrompt() {
    let nb = parseFloat(nbChar.value);
    let rand = getRandomInt(prompts.length);
    let validMod = checkMod(rand);
    let names = getNamesFromInputs(nb);
    while ((prompts[rand]["quantity"] != nb) || !validMod) {
        rand = getRandomInt(prompts.length);
        validMod = checkMod(rand);
    }
    shuffleArray(names);
    promptOutput.innerText = generateText(names, rand);
}

//gets the names from the text areas
function getNamesFromInputs(nb) {
    let temp = [];
    for (let i = 0; i < nb; i++) {
        temp[i] = nameInputs[i].value;
    }
    return temp;
}