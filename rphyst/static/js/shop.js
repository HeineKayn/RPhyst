function search() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = tables[currentIndex];

    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
        tds = tr[i].getElementsByTagName("td");
        var isContained = false;
        for (var td of tds) {
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    isContained = true
                }
            }
        }
        if (isContained) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}

function switchOnglet(index) {
    for (var table of tables) {
        table.style.display = "none";
    }
    tables[index].style.display = "block";
    tables[index].getElementsByClassName("table")[0].style.width = "100%";

    for (var onglet of onglets) {
        onglet.classList.remove("active");
    }
    onglets[index].classList.add("active");
    currentIndex = index;
}

function createItem(nom, qt, prix, prixReprise, prixAchat, rareté) {
    var table = document.getElementById("inventoryTable");
    var row = table.insertRow(1);
    row.classList.add("inventory");
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    cell1.innerHTML = nom;
    cell2.innerHTML = qt;
    cell3.innerHTML = prix;
    cell4.innerHTML = prixReprise;
    cell4.classList.add("hide-me");
    cell5.innerHTML = prixAchat;
    cell5.classList.add("hide-me");
    cell6.innerHTML = rareté;
    cell6.classList.add("hide-me");
    if (prix > 0) { row.style.color = "red" } else {
        { row.style.color = "green" }
    }
    cell6.insertAdjacentHTML("afterend", "<td class='button-cell'><button type='button' class='btn btn-danger' onclick='removeInventory(this)'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/><path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/></svg></i></button></td>");
}

function buyShop(node, qt) {
    let inventory = document.getElementsByClassName("inventory");
    let row = node.parentNode.parentNode;
    let rowChild = row.children

    var found = false;

    let nom = rowChild[0].textContent;
    let rareté = rowChild[rowChild.length - 4].textContent;
    let prixAchat = parseInt(rowChild[rowChild.length - 3].textContent);
    let prixReprise = parseInt(rowChild[rowChild.length - 2].textContent);

    if (inventory.length) {
        for (var item of inventory) {
            var [nameOld, qtOld, prixOld] = item.children;
            if (nameOld.textContent.includes(nom)) {
                found = true;
                qtOld.textContent = parseInt(qtOld.textContent) + qt;
                if (parseInt(qtOld.textContent) == 0) {
                    item.style.display = "none";
                    item.remove();
                } else {
                    if (parseInt(qtOld.textContent) > 0) {
                        prixOld.textContent = parseInt(prixOld.textContent) + prixAchat * qt;
                        item.style.color = "red";
                    } else {
                        prixOld.textContent = parseInt(prixOld.textContent) + prixReprise * qt;
                        item.style.color = "green";
                    }
                }
                break;
            }
        }
    }
    if (!found) {
        var prix;
        if (qt > 0) { prix = qt * prixAchat; } else { prix = qt * prixReprise; }
        createItem(nom, qt, prix, prixReprise, prixAchat, rareté);
    }
    updateTot()
}

function removeInventory(node) {
    let row = node.parentNode.parentNode;
    var coef = 1
    var qt = parseInt(row.children[2].textContent)
    var prix = parseInt(row.children[1].textContent)
    if (qt < 1) { coef = -1 }
    row.children[2].textContent = qt - coef * qt / prix;
    row.children[1].textContent = prix - coef;
    if (row.children[1].textContent == 0) {
        row.remove();
    }
    updateTot();
}

function updateTot() {
    let inventory = document.getElementsByClassName("inventory");
    var count = 0;
    for (var item of inventory) {
        count += parseInt(item.children[2].textContent);
    }
    totalValue.innerHTML = count;
    if (count > 0) { totalValue.style.color = "red"; } else if (count < 0) { totalValue.style.color = "green"; } else { totalValue.style.color = "white"; }
}

function talent(button) {
    if (button.classList.contains("talent-active")) {
        button.classList.remove("talent-active");
    } else {
        button.classList.add("talent-active");
    }

    for (var row of outputShop.getElementsByTagName("tr")) {
        let rowChild = row.getElementsByTagName("td");
        if (rowChild.length > 1) {
            let qt = parseInt(rowChild[1].textContent);
            let prixReprise = parseInt(rowChild[3].textContent);
            let prixAchat = parseInt(rowChild[4].textContent);
            let rareté = rowChild[5].textContent;
            let ratio = 0;
            if (qt < 0) {
                if (button.classList.contains("talent-active")) {
                    if (rareté == "Rare") { ratio = 5/100 } else if (rareté == "Unique") { ratio = 10/100 } else if (rareté == "Mythique") { ratio = 15/100 } else if (rareté == "Légendaire") { ratio = 20/100 }
                }
                rowChild[2].innerHTML = Math.round((prixReprise + prixReprise*ratio) * qt);
            } else {
                rowChild[2].innerHTML = prixAchat * qt;
            }
        }
    }
    updateTot();
}

function banCol(colNames) {
    for (var colName of colNames) {
        for (index = 0; index < tables.length; index++) {
            let ths = tables[index].getElementsByTagName("th");
            var found = false;
            for (i = 0; i < ths.length; i++) {
                if (ths[i].textContent.includes(colName)) { found = true; break }
            }
            if (found) {
                let trs = tables[index].getElementsByTagName("tr");
                for (var tr of trs) {
                    tr.children[i].classList.add("hide-me");
                }
                // dataTables[index].column(i).visible(false);
            }
        }
    }
}

var currentIndex = 0;
var tables = document.getElementsByClassName("tableShop");
var onglets = document.getElementById('onglets').children;
var total = document.getElementById('totalShop');
var outputShop = document.getElementById('outputShop');
var talentOffre = document.getElementById('talent-offre');
switchOnglet(currentIndex);

$(document).ready(function() {
    $('.table').DataTable({
        "searching": false,
        "paging": false,
        "lengthChange": false,
        "info": false
    });
    banCol(["Rareté"]);

    $('.dataTables_length').addClass('bs-select');
});