var players = []

function updateGameFront(){
    $.post('/rphyst/combat/updateFront').done(function(response) {
            tours.innerHTML = response["content"]["tour"];

            // Check for new players
            var playersBack = []
            for(var player of response["content"]["joueurs"]){
                playersBack.push(player["nom"])
                if (!players.includes(player["nom"])){addPlayerFront(player);}
            }
            // Check for removed players
            for(var player of players){
                if (!playersBack.includes(player)){removePlayerFront(player);}
            }
    });
}

// action : edit, remove, add, refresh
function updateGameBack(action,type,value){
    $.post('/rphyst/combat/updateBack', {
        "action" : action,
        "type"   : type,
        "value"  : value
    })
}

function addPlayerFront(player) {
    var clone = templatePlayer.cloneNode(true);
    clone.setAttribute('id',player["nom"]);
    clone.classList.remove("template");
    clone.children[0].children[1].innerHTML = player["init"];
    // clone.children[1]
    clone.children[2].children[0].children[0].style.width = Math.round(player["hp"] / player["stats"]["HP"] * 100) + "%";
    clone.children[2].children[0].children[0].innerHTML = player["hp"];
    players.push(player["nom"]);
    templatePlayer.after(clone);
}

function removePlayerFront(name) {
    var playerRow = document.getElementById(name);
    players.pop(players.indexOf(name));
    playerRow.remove()
}

function removePlayerBack(name) {updateGameBack("remove","perso",name)}

var tours = document.getElementById("valueTour");
var templates = document.getElementsByClassName("template");
var templatePlayer = templates[0];
var templateSpells = templates[1];

document.addEventListener("DOMContentLoaded", function() {
    updateGameFront();
    setInterval(updateGameFront,500);
});