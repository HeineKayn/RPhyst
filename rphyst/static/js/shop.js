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
    if (isContained){
        tr[i].style.display = "";
    }
    else{
        tr[i].style.display = "none";
    }
  }
}

function switchOnglet(index) {
	for (var table of tables) {
	    table.style.display = "none";
	}
    tables[index].style.display = "block";

    for (var onglet of onglets) {
	    onglet.classList.remove("active");
	}
    onglets[index].classList.add("active");
    currentIndex = index;
}

function createItem(nom,qt,prix){
    var table = document.getElementById("inventoryTable");
    var row = table.insertRow(1);
    row.classList.add("inventory");
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = nom;
    cell2.innerHTML = qt;
    cell3.innerHTML = prix;
    if (prix>0){row.style.color = "red"}
    else {{row.style.color = "green"}}
    cell3.insertAdjacentHTML("afterend", "<td class='button-cell'><button type='button' class='btn btn-danger' onclick='removeInventory(this)'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/><path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/></svg></i></button></td>");
}

function buyShop(node,qt) {
    let inventory = document.getElementsByClassName("inventory");
    let row = node.parentNode.parentNode.children;
    let nom = row[0].textContent;
    let prixAchat = row[row.length-3].textContent;
    let prixReprise = row[row.length-2].textContent;
    var found = false;

    if (inventory.length){
        for (var item of inventory) {
            var [nameOld,qtOld,prixOld] = item.children;
            if (nameOld.textContent.includes(nom)){
                found = true;
                qtOld.textContent = parseInt(qtOld.textContent) + qt;
                if (parseInt(qtOld.textContent) == 0){
                    item.style.display = "none";
                    item.remove();
                }
                else{
                    if (parseInt(qtOld.textContent) > 0) {
                        prixOld.textContent = parseInt(prixOld.textContent) + prixAchat*qt;
                        item.style.color = "red";
                    }
                    else {
                        prixOld.textContent = parseInt(prixOld.textContent) +prixReprise*qt;
                        item.style.color = "green";
                    }
                }
                break;
            }
        }
    }
    if (!found){
        var prix;
        if (qt > 0) {prix = qt*prixAchat;}
        else {prix = qt*prixReprise;}
        createItem(nom,qt,prix);
    }
    updateTot()
}

function removeInventory(node) {
    let row = node.parentNode.parentNode;
    var coef = 1
    var qt = parseInt(row.children[2].textContent)
    var prix = parseInt(row.children[1].textContent)
    if (qt<1){coef=-1} 
    row.children[2].textContent = qt - coef*qt/prix;
    row.children[1].textContent = prix - coef;
    if (row.children[1].textContent == 0){
        row.remove();
    }
    updateTot();
}

function updateTot(){
    let inventory = document.getElementsByClassName("inventory");
    var count = 0;
    for (var item of inventory) {
        count += parseInt(item.children[2].textContent);
    }
    totalValue.innerHTML = count;
    if (count > 0) {totalValue.style.color = "red";}
    else if (count < 0) {totalValue.style.color = "green";}
    else {totalValue.style.color = "white";}
}

var currentIndex = 0;
var tables = document.getElementsByClassName("tableShop");
var onglets = document.getElementById('onglets').children;
var total = document.getElementById('totalShop');
switchOnglet(currentIndex);

$(document).ready(function () {
    $('.table').DataTable({
        "searching": false,
        "paging": false,
        "lengthChange": false,
        "info":false
    });
    $('.dataTables_length').addClass('bs-select');
});

