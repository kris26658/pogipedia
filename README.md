Pogs Collection Manager
Overview

Pogs Collection Manager is a web app designed for tracking, organizing, and showcasing pog collections. Whether you’re a collector cataloging your pogs or a trader managing swaps, this app offers a simple, efficient way to manage your collection.
Features

Search & Filters

    Easily search and filter pogs by attributes like name, series, rarity, and condition.

Statistics & Insights

    View collection statistics, such as duplicates or the most valuable pogs.

Visual Showcase

    Display pogs in a clean, visually appealing layout.

    Switch between light and dark themes for a personalized experience.

Technologies Used
Frontend

    HTML, CSS, JavaScript

Backend

    Node.js with Express.js for handling requests
    SQLite database for storing pog collection data


Installation
Prerequisites

    Node.js: Ensure Node.js is installed on your system. You can download it from here.
    Visual Studio Code (VSCode): Recommended for easy development. Install it from here.

Steps

    Clone the repository
    Open your terminal and run the following command to clone the project repository:

git clone https://github.com/csmith1188/pogipedia

Open the project in Visual Studio Code
After cloning, navigate to the project directory and open it in VSCode:

cd pogs-collection-manager  
code .

Install dependencies
Open the integrated terminal in VSCode (use Ctrl + ~ or open it via the menu), and then install all necessary dependencies by running:

npm install


Start the server
Once everything is set up, start the server by running:

node app.js

Access the app
Open your web browser and visit:

    http://localhost:3000

API Endpoints
Routes

    GET /api/pogs
    Retrieve all pogs, including their tags.
    Returns a list of pogs with uid, serial, name, color, and tags.

    GET /api/pogs/:uid
    Retrieve detailed information about a pog using its unique identifier (uid).
    Returns all available data for the pog, including name, color, tags, and other details.

    GET /api/pogs/:identifier
    Retrieve pog data based on either the pogs name or a serial number.
    If the identifier is a number, it's treated as a uid. If it matches the serial pattern (e.g., 1234A01), it’s treated as a serial.
    Returns detailed information based on the identifier.

    GET /api/collections
    Retrieve a list of all unique pog tags (collections).

    GET /api/collections/:name
    Retrieve all pogs that belong to a specific collection (tag).
    Returns pogs with uid, name, and color for the selected collection.
