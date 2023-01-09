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
                    // Ajouter les spells
                    editablesUpdate();
                } else {
                    var playerRow = document.getElementById(player["nom"]);
                    editPlayer(playerRow, player);
                    // editer les spells
                }
            }
            // Check for removed players 
            for (var player of players) {
                if (!playersBack.includes(player)) { removePlayerFront(player); }
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

function editPlayer(node, stats) {
    node.children[0].children[1].innerHTML = stats["init"];
    node.children[1].children[0].src = stats["stats"]["Image"];
    node.children[2].children[0].children[0].style.width = Math.round(stats["hp"] / stats["stats"]["HP"] * 100) + "%";
    node.children[2].children[0].children[0].innerHTML = stats["hp"];
}

function addPlayerFront(player) {
    var clone = templatePlayer.cloneNode(true);
    clone.setAttribute('id', player["nom"]);
    clone.classList.remove("template");
    editPlayer(clone, player);
    players.push(player["nom"]);
    templatePlayer.after(clone);
}

function removePlayerFront(name) {
    var playerRow = document.getElementById(name);
    players.pop(players.indexOf(name));
    playerRow.remove()
}

function selectPlayer(node) {
    if (selectedPlayer != node.id) {
        if ((permission == 1) ||
            (permission == 2 && node.id == "Janin") ||
            (permission == 3 && node.id == "Couvercle") ||
            (permission == 4 && node.id == "Brouss")) {

            if (selectedPlayer != "") {
                document.getElementById(selectedPlayer).classList.remove("perso_actif");
            }
            node.classList.add("perso_actif");
            selectedPlayer = node.id;

            // Display le bon set de spell
        }
    }
}

function addPlayerBack(name) { updateGameBack("add_perso", name) }

function removePlayerBack(name) { updateGameBack("remove_perso", name) }

function typeEditable(event) {
    updateDelayer = delayerTime;
    if (event.key == 'Enter') {
        event.target.innerText = event.target.innerText.replace(/(\r\n|\n|\r)/gm, "");
        updateGameBack(event.target.id,
            event.target.innerText,
            event.target.closest(".row").id);
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