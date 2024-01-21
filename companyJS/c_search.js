import { c_db } from './c_database.js';

let allCompanies = [];
var currentSelectedCompany = null;

export const companiesState = {
	companiesLoaded: false
};

const container = document.getElementById('company-info-container');
container.style.display = 'none';

function fetchCompany(searchInput) {
	// Simulating server-side logic with client-side filtering
	return allCompanies.filter(option => option.name.toLowerCase().startsWith(searchInput.toLowerCase()));
}

async function showResults() {
	var searchInput = document.getElementById('search-input').value.toLowerCase();
	var searchResults = document.getElementById('search-results');

	if (!companiesState.companiesLoaded) {
		console.log('Companies are not loaded yet!');
		await setAllCompanies();
	}

	// Fetch Company from the client-side based on the search input
	var filteredOptions = fetchCompany(searchInput);

	// Clear previous results
	searchResults.innerHTML = '';

	// Display up to 5 filtered results as clickable buttons and sort them alphabetically
	for (var i = 0; i < filteredOptions.length; i++) {
		var listItem = document.createElement('li');
		listItem.className = 'result-item-company';
		listItem.textContent = filteredOptions[i].name;

		if (filteredOptions[i].name === currentSelectedCompany) {
			listItem.classList.add('selected');
		}

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

showResults();

function handleResultClick(event) {
    var selectedCompany = event.target.textContent;

    // Check if the clicked item is already selected
    if (selectedCompany === currentSelectedCompany) {
        return; // Do nothing if the same item is clicked again
    }

    // Remove the 'selected' class from the previously selected item
    var previouslySelected = document.querySelector('.result-item-company.selected');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected');
    }

    // Add the 'selected' class to the clicked item
    event.target.classList.add('selected');
    currentSelectedCompany = selectedCompany;

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
			companiesState.companiesLoaded = true;
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
	var searchContainer = document.getElementById('search-container-company');
	var searchResults = document.getElementById('search-results');

	if (!searchContainer.contains(event.target) && !searchResults.contains(event.target)) {
		container.style.display = 'none';
	}
});

function displayCompanyInfo(company) {
    const container = document.getElementById('company-info-container');
	container.style.display = 'block';
    container.innerHTML = ''; // Clear the container

    const companyContainer = document.createElement('div');
    companyContainer.classList.add('company-info-container');
    companyContainer.id = company.id; // Set the id of the companyContainer

    const companyNameElement = document.createElement('p');
    companyNameElement.textContent = `Ad: ${company.name}`;
    companyContainer.appendChild(companyNameElement);

    const companyAddressElement = document.createElement('p');
    companyAddressElement.textContent = `Adres: ${company.adress}`;
    companyContainer.appendChild(companyAddressElement);

    const companyMailElement = document.createElement('p');
    companyMailElement.textContent = `Mail Adresi: ${company.mailAdress}`;
    companyContainer.appendChild(companyMailElement);

    const companyFaxElement = document.createElement('p');
    companyFaxElement.textContent = `Faks No: ${company.faxNum}`;
    companyContainer.appendChild(companyFaxElement);

    const companyTaxElement = document.createElement('p');
    companyTaxElement.textContent = `Vergi No: ${company.taxNum}`;
    companyContainer.appendChild(companyTaxElement);


    // Display the products with a comma between them
	const productsContainer = document.createElement('div');
	productsContainer.classList.add('products-container');
	productsContainer.textContent = `Ürünler: ${company.products.join(', ')}`;


    companyContainer.appendChild(productsContainer);
    container.appendChild(companyContainer);
}
