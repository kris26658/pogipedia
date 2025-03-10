// Function to display the specified tab by adding 'active' class to it
function showTab(tabId) {
    var tabs = document.querySelectorAll('.tab'); // Select all tab elements
    tabs.forEach(function (tab) {
        tab.classList.remove('active'); // Remove 'active' class from all tabs
    });
    document.getElementById(tabId).classList.add('active'); // Add 'active' class to the selected tab
}

// Function to search for Pogs based on user input
function searchPogs() {
    // Get user input values from search fields
    var idInput = document.getElementById("searchIdInput").value;
    var nameInput = document.getElementById("searchNameInput").value;
    var serialInput = document.getElementById("searchSerialInput").value;
    var tagsInput = document.getElementById("searchTagsInput").value;

    // Send a POST request to search for Pogs
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
    .then(response => response.json()) // Convert response to JSON
    .then(data => {
        var table = document.getElementById("allPogsTable").getElementsByTagName('tbody')[0];
        table.innerHTML = ''; // Clear existing table rows
        data.forEach(function (pog) {
            var row = table.insertRow(); // Insert a new row for each Pog
            row.style.backgroundColor = pog.backgroundColor; // Set the background color based on rank
            row.insertCell(0).innerText = pog.uid; // Add UID cell
            row.insertCell(1).innerText = pog.serial; // Add serial number cell
            row.insertCell(2).innerText = pog.name; // Add name cell
            row.insertCell(3).innerText = pog.color; // Add color cell
            row.insertCell(4).innerText = pog.tags; // Add tags cell
            row.addEventListener('click', function () {
                showPogDetails(pog.uid); // Show details of clicked Pog
            });
        });
    });
}

// Function to sort the Pog table by specified column
function sortTable(n, isNumeric = false, dir = "asc") {
    var table, rows, switching, i, x, y, shouldSwitch, switchcount = 0;
    table = document.getElementById("allPogsTable");
    switching = true; // Start the switching process
    while (switching) {
        switching = false; // Reset switching flag
        rows = table.rows; // Get all rows in the table
        for (i = 1; i < (rows.length - 1); i++) { // Loop through table rows (skipping header)
            shouldSwitch = false; // Reset shouldSwitch flag
            x = rows[i].getElementsByTagName("TD")[n]; // Get current row's column value
            y = rows[i + 1].getElementsByTagName("TD")[n]; // Get next row's column value
            // Check sorting direction
            if (dir == "asc") {
                if (isNumeric) {
                    if (parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
                        shouldSwitch = true; // Set flag to switch rows
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
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]); // Switch rows
            switching = true; // Continue switching
            switchcount++; // Increment switch count
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc"; // Change direction to descending if no switches
                switching = true;
            }
        }
    }
}

// Function to handle sorting based on user-selected option
function handleSort() {
    var sortOption = document.getElementById("sortOptions").value; // Get selected sort option
    // Call sortTable function with appropriate parameters based on selected option
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

// Function to fetch and display details of a selected Pog
function showPogDetails(uid) {
    fetch(`/api/pogs/${uid}`)
        .then(response => response.json()) // Convert response to JSON
        .then(data => {
            console.log('Fetched data:', data); // Log fetched data for debugging
            var modal = document.getElementById("pogDetailsModal"); // Get modal element
            var modalContent = document.getElementById("pogDetailsContent"); // Get modal content element
            var imageUrl = `/pogs/${data.url}.JPG`; // Construct the image URL for JPG
            var imageUrl2 = `/pogs/${data.url}.png`; // Construct the image URL for PNG
            console.log('Image URL:', imageUrl); // Log image URL for debugging
            // Populate modal content with Pog details
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
            modal.style.display = "flex"; // Show modal
        })
        .catch(error => {
            console.error('Error fetching pog details:', error); // Log error if fetching fails
        });
}

// Document ready event to set up theme switch and preferences
document.addEventListener('DOMContentLoaded', function () {
    var themeSwitch = document.getElementById('themeSwitch');

    // Check local storage for theme preference
    var isDarkMode = localStorage.getItem('darkMode') === 'true';
    themeSwitch.checked = isDarkMode; // Set switch state based on stored preference
    applyTheme(isDarkMode); // Apply theme

    themeSwitch.addEventListener('change', function () {
        var isDarkMode = themeSwitch.checked; // Get new theme preference

        // Show a confirmation dialog before changing theme
        var confirmChange = confirm("Changing the theme will reload the page, which means your search will revert back to default. Do you want to proceed?");
        if (confirmChange) {
            applyTheme(isDarkMode); // Apply selected theme

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
                clearSearchInputs(); // Clear search inputs
                location.reload(); // Reload page to apply the theme change
            });
        } else {
            // Revert the switch to its previous state
            themeSwitch.checked = !isDarkMode;
        }
    });
});

// Function to clear all search input fields
function clearSearchInputs() {
    document.getElementById("searchIdInput").value = '';
    document.getElementById("searchNameInput").value = '';
    document.getElementById("searchSerialInput").value = '';
    document.getElementById("searchTagsInput").value = '';
}

// Function to apply dark or light theme based on user preference
function applyTheme(isDarkMode) {
    if (isDarkMode) {
        document.body.classList.add('dark-mode'); // Add dark mode class to body
        document.querySelector('.modal-content').classList.add('dark-mode'); // Add dark mode to modal content
        document.querySelector('.color-guide').classList.add('dark-mode'); // Add dark mode to color guide
    } else {
        document.body.classList.remove('dark-mode'); // Remove dark mode class from body
        document.querySelector('.modal-content').classList.remove('dark-mode'); // Remove dark mode from modal content
        document.querySelector('.color-guide').classList.remove('dark-mode'); // Remove dark mode from color guide
    }
}

// Function to close the modal
function closeModal() {
    var modal = document.getElementById("pogDetailsModal");
    modal.style.display = "none"; // Hide modal
}

// Window onload event to initialize modal state and prompt for dark mode
window.onload = function () {
    var modal = document.getElementById("pogDetailsModal");
    modal.style.display = "none"; // Ensure the modal is hidden when the page loads

    // Check if the user has been prompted for dark mode before
    if (!localStorage.getItem('darkModePrompted')) {
        // Prompt the user for dark mode
        var isDarkMode = confirm("Would you like to enable dark mode?");
        applyTheme(isDarkMode); // Apply selected theme

        // Store the user's preference and that they have been prompted
        localStorage.setItem('darkModePrompted', 'true');
        localStorage.setItem('darkMode', isDarkMode);
    } else {
        // Apply the stored theme preference
        var isDarkMode = localStorage.getItem('darkMode') === 'true';
        applyTheme(isDarkMode);
    }
}

// Window click event to close modal when clicking outside of it
window.onclick = function (event) {
    var modal = document.getElementById("pogDetailsModal");
    if (event.target == modal) {
        modal.style.display = "none"; // Hide modal
    }
}