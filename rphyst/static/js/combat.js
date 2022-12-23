var players = []

function updateGame(){
    $.post('/rphyst/combat/update').done(function(response) {
            tours.innerHTML = response["content"]["tour"];
            for(var player of response["content"]["joueurs"]){
                if (!players.includes(player["nom"])){
                    addPlayer(player);
                }
            }
    });
}

// Si on a demandé à update la partie et qu'un joueur n'est pas dans ceux affichés
function addPlayer(player) {
    var clone = templatePlayer.cloneNode(true);
    clone.classList.remove("template");
    clone.children[0].children[1].innerHTML = player["init"];
    // clone.children[1]
    clone.children[2].children[0].children[0].style.width = Math.round(player["hp"] / player["stats"]["HP"] * 100) + "%";
    clone.children[2].children[0].children[0].innerHTML = player["hp"];
    players.push(player["nom"]);
    templatePlayer.after(clone);
}

var tours = document.getElementById("valueTour");
var templates = document.getElementsByClassName("template");
var templatePlayer = templates[0];
var templateSpells = templates[1];

document.addEventListener("DOMContentLoaded", function() {
    setInterval(updateGame,500);
});