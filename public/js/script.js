function showTab(tabId) {
    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function (tab) {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}
function searchPogs() {
var idInput = document.getElementById("searchIdInput").value;
var nameInput = document.getElementById("searchNameInput").value;
var serialInput = document.getElementById("searchSerialInput").value;
var tagsInput = document.getElementById("searchTagsInput").value;

fetch('/searchPogs', {
method: 'POST',
headers: {
    'Content-Type': 'application/json'
},
body: JSON.stringify({
    id: idInput,
    name: nameInput,
    serial: serialInput,
    tags: tagsInput
})
})   .then(response => response.json())
        .then(data => {
            var table = document.getElementById("allPogsTable").getElementsByTagName('tbody')[0];
            table.innerHTML = '';
            data.forEach(function (pog) {
                var row = table.insertRow();
                row.style.backgroundColor = pog.backgroundColor; // Set the background color based on rank
                row.insertCell(0).innerText = pog.uid;
                row.insertCell(1).innerText = pog.serial;
                row.insertCell(2).innerText = pog.name;
                row.insertCell(3).innerText = pog.color;
                row.insertCell(4).innerText = pog.tags;
                row.addEventListener('click', function () {
                    showPogDetails(pog.uid);
                });
            });
        });

}

function sortTable(n, isNumeric = false, dir = "asc") {
    var table, rows, switching, i, x, y, shouldSwitch, switchcount = 0;
    table = document.getElementById("allPogsTable");
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
                if (isNumeric) {
                    if (parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
                        shouldSwitch = true;
                        break;
                    }
                } else {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                }
            } else if (dir == "desc") {
                if (isNumeric) {
                    if (parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
                        shouldSwitch = true;
                        break;
                    }
                } else {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function handleSort() {
    var sortOption = document.getElementById("sortOptions").value;
    switch (sortOption) {
        case "idAsc":
            sortTable(0, true, "asc");
            break;
        case "idDesc":
            sortTable(0, true, "desc");
            break;
        case "nameAsc":
            sortTable(2, false, "asc");
            break;
        case "nameDesc":
            sortTable(2, false, "desc");
            break;
        case "serial":
            sortTable(1);
            break;
        case "color":
            sortTable(3);
            break;
        case "tags":
            sortTable(4);
            break;
    }
}

function showPogDetails(uid) {
    fetch(`/api/pogs/${uid}`)
        .then(response => response.json())
        .then(data => {
            var modal = document.getElementById("pogDetailsModal");
            var modalContent = document.getElementById("pogDetailsContent");
            var imageUrl = `/pogs/${data.name}${uid}.png`; // Construct the image URL directly using the UID
            console.log('Image URL:', imageUrl); // Log the image URL for debugging
            modalContent.innerHTML = `
    <div class="modal-text">
        <span class="close" onclick="closeModal()">&times;</span>
        <h2>Pog Details</h2>
        <p><strong>ID:</strong> ${data.uid}</p>
        <p><strong>Serial:</strong> ${data.serial}</p>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Color:</strong> ${data.color}</p>
        <p><strong>Tags:</strong> ${data.tags}</p>
        <p><strong>Lore:</strong> ${data.lore}</p>
        <p><strong>Rank:</strong> ${data.rank}</p>
        <p><strong>Creator:</strong> ${data.creator}</p>
    </div>
 <div class="modal-image">

</div>
`;
            modal.style.display = "flex";
        });
}

function closeModal() {
    var modal = document.getElementById("pogDetailsModal");
    modal.style.display = "none";
}

window.onload = function () {
    var modal = document.getElementById("pogDetailsModal");
    modal.style.display = "none"; // Ensure the modal is hidden when the page loads
}

window.onclick = function (event) {
    var modal = document.getElementById("pogDetailsModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}