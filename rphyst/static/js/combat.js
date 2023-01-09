var players = []
var selectedPlayer = ""
var permission = 0
var updateDelayer = 0
let delayerTime = 2

function updateGameFront() {
    if (updateDelayer < 1) {
        $.post('/rphyst/combat/updateFront').done(function(response) {
            permission = response["permission"]
            tours.innerHTML = response["partie"]["tour"];

            // Check for new players
            // Update existing
            var playersBack = []
            for (var player of response["partie"]["joueurs"]) {
                playersBack.push(player["nom"])
                if (!players.includes(player["nom"])) {
                    addPlayerFront(player);
                    addSpellFront(player);
                    editablesUpdate();
                } else {
                    editPlayer(player);
                    editSpell(player);
                }
            }
            // Check for removed players 
            for (var player of players) {
                if (!playersBack.includes(player)) {
                    removePlayerFront(player);
                    removeSpellFront(player);
                }
            }
        });
    } else { updateDelayer -= 1 };
}

// action : edit, remove, add, refresh
function updateGameBack(action, value1, value2 = 0) {
    $.post('/rphyst/combat/updateBack', {
        "action": action,
        "value1": value1,
        "value2": value2
    })
}

function editPlayer(stats) {
    var node = templatePlayer.parentNode.querySelector("[perso=" + CSS.escape(stats["nom"]) + "]");
    node.children[1].children[1].innerHTML = stats["init"];
    node.children[2].children[0].src = stats["stats"]["Image"];
    node.children[3].children[0].children[0].style.width = Math.round(stats["hp"] / stats["stats"]["HP"] * 100) + "%";
    node.children[3].children[0].children[0].innerHTML = stats["hp"];
}

function addPlayerFront(player) {
    var clone = templatePlayer.cloneNode(true);
    clone.setAttribute("perso", player["nom"]);
    clone.classList.remove("template");
    players.push(player["nom"]);
    templatePlayer.after(clone);
    editPlayer(player);
}

function removePlayerFront(name) {
    var node = templatePlayer.parentNode.querySelector("[perso=" + CSS.escape(stats["nom"]) + "]");
    players.pop(players.indexOf(name));
    node.remove()
}

function removeSpellFront(name) {
    var node = templateSpells.parentNode.querySelector("[perso=" + CSS.escape(stats["nom"]) + "]");
    node.remove()
}

function editSpell(stats) {
    var node = templateSpells.parentNode.querySelector("[perso=" + CSS.escape(stats["nom"]) + "]");
    // node.children[0].children[1].innerHTML = stats["init"];
    // node.children[1].children[0].src = stats["stats"]["Image"];
    // node.children[2].children[0].children[0].style.width = Math.round(stats["hp"] / stats["stats"]["HP"] * 100) + "%";
    // node.children[2].children[0].children[0].innerHTML = stats["hp"];
}


function addSpellFront(player) {
    var clone = templateSpells.cloneNode(true);
    clone.setAttribute("perso", player["nom"]);
    clone.classList.remove("template");
    templateSpells.after(clone);
    editSpell(player);
}

function selectPlayer(playerTable) {
    var name = playerTable.getAttribute("perso");
    if (selectedPlayer != name) {
        if ((permission == 1) || true ||
            (permission == 2 && name == "Janin") ||
            (permission == 3 && name == "Couvercle") ||
            (permission == 4 && name == "Brouss")) {

            if (selectedPlayer != "") {
                var oldPlayer = document.getElementsByClassName("perso_actif")[0];
                oldPlayer.classList.remove('perso_actif');
                var oldSpell = document.getElementsByClassName("spell_actif")[0];
                oldSpell.classList.remove('spell_actif');
            }
            playerTable.classList.add("perso_actif");
            var spellTable = templateSpells.parentNode.querySelector("[perso=" + CSS.escape(name) + "]");
            // PROBLEME ICI parce que y'a pas de div 
            spellTable.classList.add("spell_actif");
            selectedPlayer = name;
        }
    }
}

function addPlayerBack(name) { updateGameBack("add_perso", name) }

function removePlayerBack(name) { updateGameBack("remove_perso", name) }

function typeEditable(event) {
    updateDelayer = delayerTime;
    if (event.key == 'Enter') {
        event.target.innerText = event.target.innerText.replace(/(\r\n|\n|\r)/gm, "");
        updateGameBack(event.target.getAttribute("perso"),
            event.target.innerText,
            event.target.closest(".row").getAttribute("perso"));
    }
}

function editablesUpdate() {
    var editables = document.getElementsByClassName("editable");
    for (editor of editables) {
        if (permission == 1) {
            editor.setAttribute("contentEditable", "plaintext-only");
            editor.addEventListener("keyup", typeEditable);
            editor.addEventListener("click", typeEditable);
        } else {
            editor.setAttribute("contentEditable", "false");
            editor.removeEventListener("keyup", typeEditable);
            editor.addEventListener("click", typeEditable);
        }
    }
}

var tours = document.getElementById("valueTour");
var templates = document.getElementsByClassName("template");
var templatePlayer = templates[0];
var templateSpells = templates[1];

document.addEventListener("DOMContentLoaded", function() {
    updateGameFront();
    setInterval(updateGameFront, 500);
});