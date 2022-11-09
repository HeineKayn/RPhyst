function rollLoots() {
    $.ajax({
        type: "POST",
        url: '/rphyst/loot/roll',
        dataType: 'json',
        data: {
            'loots': document.getElementById("inputLoot").value,
            'n': document.getElementById("nbLoot").value
        },
        success: function(data) {
            document.getElementById("outputLoot").value = data[0];
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("confirmLoot").addEventListener("click", rollLoots);
});