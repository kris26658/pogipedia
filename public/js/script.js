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
    })
        .then(data => {
            console.log('Fetched pogs:', data); // Debugging: Log the fetched data
            var table = document.getElementById("allPogsTable").getElementsByTagName('tbody')[0];
            table.innerHTML = '';
            data.forEach(function (pog) {
                var row = table.insertRow();
                row.style.backgroundColor = pog.backgroundColor;
                row.insertCell(0).innerText = pog.uid;
                row.insertCell(1).innerText = pog.serial;
                row.insertCell(2).innerText = pog.name;
                row.insertCell(3).innerText = pog.color;
                row.insertCell(4).innerText = pog.tags;
                row.addEventListener('click', function () {
                    showPogDetails(pog.uid);
                });
            });
        })

}
// Log the initial screen size
console.log(`Screen size: ${window.innerWidth}x${window.innerHeight}`);

// Add an event listener to log the screen size on window resize
window.addEventListener('resize', () => {
    console.log(`Screen size: ${window.innerWidth}x${window.innerHeight}`);
});
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
    
} function showPogDetails(uid) {
    fetch('/api/pogs')
    .then(response => response.json())
    .then(pogs => {
            const modal = document.getElementById("pogDetailsModal");
            const modalContent = document.getElementById("pogDetailsContent");
            const imageUrl = `/pogs/${data.imageUrl}`;
            const fallbackImageUrl = `/pogs/${data.imageUrl.replace('.JPG', '.png')}`;

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
                    <img id="pogImage" class="resized-image" src="${imageUrl}" alt="${data.name}" onerror="this.onerror=null;this.src='${fallbackImageUrl}';" />
                </div>
            `;
            modal.style.display = "flex";
        })
        .catch(error => console.error('Error fetching pog details:', error));

} 
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
    })
        .then(response => response.json())
        .then(data => {
            var table = document.getElementById("allPogsTable").getElementsByTagName('tbody')[0];
            table.innerHTML = ''; // Clear the table before adding new rows
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
        })
        .catch(error => {
            console.error('Error fetching pogs:', error);
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
            console.log('Fetched data:', data); // Log the entire data object for debugging
            var modal = document.getElementById("pogDetailsModal");
            var modalContent = document.getElementById("pogDetailsContent");
            var imageUrl = `/pogs/${data.url}.JPG`; // Construct the image URL using the url from the database
            var imageUrl2 = `/pogs/${data.url}.png`; // Construct the second image URL using the url from the database
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
                    <img id="pogImage" class="resized-image" src="${imageUrl}" alt="${data.name}" onerror="this.onerror=null;this.src='${imageUrl2}';" />
                </div>
            `;
            modal.style.display = "flex";
        })
        .catch(error => {
            console.error('Error fetching pog details:', error);
        });
}
document.addEventListener('DOMContentLoaded', function () {
    var themeSwitch = document.getElementById('themeSwitch');

    // Check local storage for theme preference
    var isDarkMode = localStorage.getItem('darkMode') === 'true';
    themeSwitch.checked = isDarkMode;
    applyTheme(isDarkMode);

    themeSwitch.addEventListener('change', function () {
        var isDarkMode = themeSwitch.checked;

        // Apply the theme immediately without confirmation
        applyTheme(isDarkMode);

        // Store the theme preference in local storage
        localStorage.setItem('darkMode', isDarkMode);

        // Send the theme preference to the server
        fetch('/setTheme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ darkMode: isDarkMode })
        }).then(() => {
            // Clear the search inputs
            clearSearchInputs();

            // Reload the page to apply the theme change
            location.reload();
        });
    });
});

function clearSearchInputs() {
    document.getElementById("searchIdInput").value = '';
    document.getElementById("searchNameInput").value = '';
    document.getElementById("searchSerialInput").value = '';
    document.getElementById("searchTagsInput").value = '';
}

function applyTheme(isDarkMode) {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.querySelector('.modal-content').classList.add('dark-mode');
        document.querySelector('.color-guide').classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
        document.querySelector('.modal-content').classList.remove('dark-mode');
        document.querySelector('.color-guide').classList.remove('dark-mode');
    }
}

function closeModal() {
    var modal = document.getElementById("pogDetailsModal");
    modal.style.display = "none";
}
window.onload = function () {
    // Ensure the modal is hidden when the page loads
    var modal = document.getElementById("pogDetailsModal");
    if (modal) {
        modal.style.display = "none";
    }

    // Add the "loaded" class to the body to prevent FOUC
    document.body.classList.add('loaded');

    // Temporarily comment out adjustTable for debugging
    // adjustTable();

    // Add an event listener to adjust the table on window resize
    window.addEventListener('resize', adjustTable);
};

// Check if the user has been prompted for dark mode before
if (!localStorage.getItem('darkModePrompted')) {
    var isDarkMode = confirm("Would you like to enable dark mode?");
    applyTheme(isDarkMode);

    // Store the user's preference and that they have been prompted
    localStorage.setItem('darkModePrompted', 'true');
    localStorage.setItem('darkMode', isDarkMode);
} else {
    var isDarkMode = localStorage.getItem('darkMode') === 'true';
    applyTheme(isDarkMode);
}

// Add the "loaded" class to the body to prevent FOUC
document.body.classList.add('loaded');

// Adjust the table layout based on screen size
adjustTable();

// Add an event listener to adjust the table on window resize
window.addEventListener('resize', adjustTable);
;

// Function to adjust the table layout
function adjustTable() {
    const screenWidth = window.innerWidth;
    const table = document.getElementById('allPogsTable');
    if (!table) return;

    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    
    // Fetch pogs data from the server
    fetch('/api/pogs')
        .then(response => response.json())
        .then(pogs => {
            thead.innerHTML = '';

            if (screenWidth > 980) {
                thead.innerHTML = `
                            <tr>
                                <th>ID</th>
                                <th>Serial</th>
                                <th>Name</th>
                                <th>Color</th>
                                <th>Tags</th>
                            </tr>
                        `;
                        tbody.innerHTML = pogs.map(pog => `
                            <tr class="list-color-change" style="background-color: ${getBackgroundColor(pog.rank)};" onclick="showPogDetails(${pog.uid})">
                                <td data-label="ID">${pog.uid}</td>
                                <td data-label="Serial">${pog.serial}</td>
                                <td data-label="Name">${pog.name}</td>
                                <td data-label="Color">${pog.color}</td>
                                <td data-label="Tags">${pog.tags}</td>
                            </tr>
                        `).join('');
            } else {
                thead.innerHTML = `
                            <tr>
                                <th>ID</th>
                                <th>Serial</th>
                                <th>Name</th>
                               
                            </tr>
                        `;
                tbody.innerHTML = pogs.map(pog => `
                            <tr class="list-color-change" style="background-color: ${getBackgroundColor(pog.rank)};" onclick="showPogDetails(${pog.uid})">
                                <td data-label="ID">${pog.uid}</td>
                                <td data-label="Serial">${pog.serial}</td>
                                <td data-label="Name">${pog.name}</td>
                              
                            </tr>
                        `).join('');
            }
        })
        .catch(error => console.error('Error fetching pogs:', error));
}
// Function to apply the theme
function applyTheme(isDarkMode) {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.querySelector('.modal-content').classList.add('dark-mode');
        document.querySelector('.color-guide').classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
        document.querySelector('.modal-content').classList.remove('dark-mode');
        document.querySelector('.color-guide').classList.remove('dark-mode');
    }
}

// Function to close the modal
function closeModal() {
    var modal = document.getElementById("pogDetailsModal");
    if (modal) {
        modal.style.display = "none";
    }
}

// Event listener for clicking outside the modal
window.onclick = function (event) {
    var modal = document.getElementById("pogDetailsModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
function getBackgroundColor(rank) {
    const lightRanks = {
        'Uncommon': '#EBF8DC',
        'Trash': '#fcdcdc',
        'Common': '#ffedc1',
        'Rare': '#DCF2F8',
        'Mythic': '#E7D5F3',
        'Default': '#FFFFFF'
    };

    const darkRanks = {
        'Uncommon': '#3d442f',
        'Trash': '#412020',
        'Common': '#4b3317',
        'Rare': '#2d3f4d',
        'Mythic': '#34314b',
        'Default': '#333333'
    };

    const isDarkMode = document.body.classList.contains('dark-mode');
    const ranks = isDarkMode ? darkRanks : lightRanks;

    // Fallback if rank is undefined or invalid
    return ranks[rank] || ranks['Default'];
}