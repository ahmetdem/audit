import { c_db } from './c_database.js';
import { displayCompanyInfo } from './c_display.js';

let allCompanies = [];
let companiesLoaded = false;

function fetchCompany(searchInput) {
	// Simulating server-side logic with client-side filtering
	return allCompanies.filter(option => option.name.toLowerCase().startsWith(searchInput.toLowerCase()));
}

async function showResults() {
	var searchInput = document.getElementById('search-input').value.toLowerCase();
	var searchResults = document.getElementById('search-results');

	if (!companiesLoaded) {
        await setAllCompanies();
    }

	// Fetch Company from the client-side based on the search input
	var filteredOptions = fetchCompany(searchInput);

	// Clear previous results
	searchResults.innerHTML = '';

	// Display up to 5 filtered results as clickable buttons and sort them alphabetically
	for (var i = 0; i < Math.min(filteredOptions.length, 20); i++) {
		var listItem = document.createElement('li');
		listItem.className = 'result-item-company';
		listItem.textContent = filteredOptions[i].name;

		searchResults.appendChild(listItem);
	}

	// Show the results container
	searchResults.style.display = 'block';
}

const searchInput = document.getElementById('search-input');

// Event listener for real-time updates
searchInput.addEventListener('input', function () {
	showResults(); // You can add debounce or delay here for better performance
});

searchInput.addEventListener('focus', function () {
	showResults();
});

// Event listener to close results when clicking outside the search container
document.addEventListener('click', function (event) {
	var searchContainer = document.getElementById('search-container');
	var searchResults = document.getElementById('search-results');

	// Check if the click target is outside the search container
	if (!searchContainer.contains(event.target) && !searchResults.contains(event.target)) {
		// Hide the results
		searchResults.style.display = 'none';
	}
});

function handleResultClick(event) {
	var selectedCompany = event.target.textContent;
	displayCompanyDetails(selectedCompany);
}

// Function to display details of the selected Company
function displayCompanyDetails(companyName) {
	// display the product questions and options using the function
	var selectedCompany = allCompanies.find(company => company.name === companyName);
	displayCompanyInfo(selectedCompany);
}

function setAllCompanies() {
    return new Promise((resolve) => {
        c_db.findAllCompanies((companies) => {
            allCompanies = companies;
            companiesLoaded = true;
            console.log(allCompanies);
            resolve();  // Resolve the promise once Company are loaded
        });
    });
}

// Event listener for real-time updates
document.getElementById('search-input').addEventListener('input', function () {
	showResults();
});

document.getElementById('search-results').addEventListener('click', handleResultClick);

// Event listener to close results when clicking outside the search container
document.addEventListener('click', function (event) {
	var searchContainer = document.getElementById('search-container');
	var searchResults = document.getElementById('search-results');

	if (!searchContainer.contains(event.target) && !searchResults.contains(event.target)) {
		searchResults.style.display = 'none';
	}
});
