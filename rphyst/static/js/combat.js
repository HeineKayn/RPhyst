function updateGame(){
    $.post('/rphyst/combat/update'
        ).done(function(response) {
            console.log(response["content"])
    });
}

// Si on a demandé à update la partie et qu'un joueur n'est pas dans ceux affichés
function addPlayer(name) {
    
}


document.addEventListener("DOMContentLoaded", function() {
    setInterval(updateGame,500);
  });