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

//gets the current mod 
function getCurrentMod() {
    if (mods[2].checked || (mods[0].checked && mods[1].checked) || (!mods[0].checked && !mods[1].checked && !mods[2].checked)) return "all";
    //a lot of complicated conditions to basically prevent the site from collapsing on itself
    else if (mods[0].checked) return "wtsmp";
    else if (mods[1].checked) return "bir";
}

//shuffles a given array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var rnd = getRandomInt(i + 1);
        if (array[rnd] !== "" && array[i] !== "") {
            var temp = array[i];
            array[i] = array[rnd];
            array[rnd] = temp;
        }
    }
}