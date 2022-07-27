let prompts = ""

//gets the json file containing all the prompts
fetch('prompts.json')
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
function updateNameInputs(e) {
    let nb = parseFloat(nbChar.value);
    for (let i = 0; i < nameInputs.length; i++) {
        nameInputs[i].readOnly = true;
        if (i < nb) {
            nameInputs[i].readOnly = false;
        }
    }
}

//generates a certain prompt
function testPrompts(e) {
    let promptNumber = 9
    let names = getNamesFromInputs(4);
    promptOutput.innerText = generateText(names, promptNumber);
}

//gets and updates the current number of possible quotes, based on the mod and the number of names
function updatePossibleNumber(e) {
    let nb = parseFloat(nbChar.value);
    let count = 0;
    for (let i = 0; i < prompts.length; i++) {
        if (prompts[i]["quantity"] === nb && getCurrentMod() === "all") count++;
        else if (prompts[i]["quantity"] === nb && prompts[i]["tag"] === getCurrentMod()) count++;
    }
    nbPossible.innerText = count + " possible quotes";
}

//gets the current mod 
function getCurrentMod() {
    if (mods[2].checked || (mods[0].checked && mods[1].checked) || (!mods[0].checked && !mods[1].checked && !mods[2].checked)) return "all";
    else if (mods[0].checked) return "wtsmp";
    else if (mods[1].checked) return "bir";
}

//generates a random prompt
function generatePrompt(e) {
    let nb = parseFloat(nbChar.value);
    let rand = getRandomInt(prompts.length);
    let validMod = checkMod(rand);
    let names = getNamesFromInputs(nb);
    while ((prompts[rand]["quantity"] != nb) || !validMod) {
        rand = getRandomInt(prompts.length);
        validMod = checkMod(rand);
    }
    promptOutput.innerText = generateText(names, rand);
}

//generates the text of the prompt
function generateText(names, rand) {
    let temp = "";
    shuffleArray(names)
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

//returns true if the selected quote (of index rand) is conform with the current mod, false otherwise
function checkMod(rand) {
    return mods[2].checked || (mods[0].checked && mods[1].checked) || (mods[1].checked && prompts[rand]["tag"] === "bir") || (mods[0].checked && prompts[rand]["tag"] === "wtsmp") || (!mods[0].checked && !mods[1].checked && !mods[2].checked);
}

//gets the names from the text areas
function getNamesFromInputs(nb) {
    let temp = [];
    for (let i = 0; i < nb; i++) {
        temp[i] = nameInputs[i].value;
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

//shuffles a given array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var rnd = getRandomInt(i + 1);
        if(array[rnd] !== "" && array[i] !== "") {
            var temp = array[i];
            array[i] = array[rnd];
            array[rnd] = temp;
        }
    }
}

//returns a random int between 0 and max
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

//inserts a string into a string at a given position
function insertIntoString(str, ins, pos) {
    return [str.slice(0, pos), ins, str.slice(pos)].join('');
}