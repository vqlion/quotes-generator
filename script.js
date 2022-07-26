import prompts from './prompts.json' assert {type: 'json'}

const nameInputs = document.getElementsByClassName("name")
const nbChar = document.getElementById("nb_char")

const submitButton = document.getElementById("sub_button")
const promptOutput = document.getElementById("prompt")

const mods = document.getElementsByClassName("check_mod")

console.log(prompts.length)
let p = 0

updateNameInputs(0)
nbChar.addEventListener('change', updateNameInputs)
submitButton.addEventListener('click', generatePrompt)

function updateNameInputs(e) {
    let nb = parseFloat(nbChar.value)
    for (let i = 0; i < nameInputs.length; i++) {
        nameInputs[i].readOnly = true
        if (i < nb) {
            nameInputs[i].readOnly = false
        }
    }
}

function testPrompts(e) {
    let names = getNamesFromInputs(4)
    promptOutput.innerText = generateText(names, p)
    console.log(p)
    p++
}

function generatePrompt(e) {
    let nb = parseFloat(nbChar.value)
    let rand = getRandomInt(prompts.length)
    let validMod = checkMod(rand)
    let names = getNamesFromInputs(nb)
    let output = ""
    while ((prompts[rand]["quantity"] != nb) || !validMod) {
        rand = getRandomInt(prompts.length)
        validMod = checkMod(rand)
    }
    output = generateText(names, rand)
    promptOutput.innerText = output
}

function generateText(names, rand) {
    let temp = ""
    for (let i = 0; i < prompts[rand]["lines"].length; i++) {
        temp += names[prompts[rand]["lines"][i]["person"]] + " : "
        let content = prompts[rand]["lines"][i]["text"]
        if (prompts[rand]["lines"][i].hasOwnProperty("integs")) {
            content = addIntegratedText(names, rand, content, i)
        }
        temp += content
        temp += "\n"
    }
    return temp
}

function checkMod(rand) {
    return mods[2].checked || (mods[0].checked && mods[1].checked) || (mods[1].checked && prompts[rand]["tag"] === "bir") || (mods[0].checked && prompts[rand]["tag"] === "wtsmp") || (!mods[0].checked && !mods[1].checked && !mods[2].checked)
}

function getNamesFromInputs(nb) {
    let temp = []
    for (let i = 0; i < nb; i++) {
        temp[i] = nameInputs[i].value
    }
    return temp
}

function addIntegratedText(names, rand, content, i) {
    let offset = 0
    for (let j = 0; j < prompts[rand]["lines"][i]["integs"].length; j++) {
        content = insertIntoString(content, names[prompts[rand]["lines"][i]["integs"][j]["person"]], prompts[rand]["lines"][i]["integs"][j]["value"] + offset)
        offset += names[prompts[rand]["lines"][i]["integs"][j]["person"]].length
    }
    return content
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function insertIntoString(str, ins, pos) {
    return [str.slice(0, pos), ins, str.slice(pos)].join('');
}