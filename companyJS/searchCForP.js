import { c_db } from './c_database.js';
import { p_db } from '../productJS/p_database.js';
import { displayQuestionsAndOptions } from '../productJS/p_display.js';

let allCompanies = [];
let companiesLoaded = false;
var currentSelectedCompany = null;

export let g_Company;

let companyLength = 0;

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

	// choose the selected company
	getProductsFromChoosenCompany(selectedCompany);

	// display the first product of the selected company
	c_db.findCompanyByName(selectedCompany, (company) => {
		console.log(company);
		g_Company = company;
		p_db.findProductByName(company.products[0], (product) => {
			console.log(product);
			displayQuestionsAndOptions(product);
		});
	});	
}


function getProductsFromChoosenCompany(selectedCompany) {
	c_db.findCompanyByName(selectedCompany, (company) => {

		// Save the selected company
		g_Company = company;

		const companyProducts = company.products;
		const dropdown = document.getElementById('product-dropdown');

		// Clear existing options
		dropdown.innerHTML = '';

		// Add products to the dropdown
		companyProducts.forEach(product => {
			const option = document.createElement('option');
			option.value = product;
			option.text = product;
			dropdown.appendChild(option);
		});
	});
}

document.getElementById('product-dropdown').addEventListener('change', handleProductSelection);

function handleProductSelection(event) {

	p_db.isExistProductByName(event.target.value)
		.then((productExists) => {
			if (productExists) {
				const selectedProduct = event.target.value;

				p_db.findProductByName(selectedProduct, (product) => {
					console.log(product);
					displayQuestionsAndOptions(product);
				});
			} else {
				alert(`"${event.target.value}" adında bir ürün yok.`);
			}
		})
		.catch((error) => {
			console.error(`Error checking product existence: ${error}`);
		});
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

document.getElementById('search-results').addEventListener('click', handleResultClick);