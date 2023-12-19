import { db } from './script.js';

let allProducts = [];

function fetchProducts(searchInput) {
	// Simulating server-side logic with client-side filtering
	return allProducts.filter(option => option.name.toLowerCase().startsWith(searchInput.toLowerCase()));
}

async function showResults() {
	var searchInput = document.getElementById('search-input').value.toLowerCase();
	var searchResults = document.getElementById('search-results');
	var productInfo = document.getElementById('product-info');
	var productDescription = document.getElementById('product-description');

	// Fetch products from the client-side based on the search input
	var filteredOptions = fetchProducts(searchInput);

	// Clear previous results
	searchResults.innerHTML = '';

	// Display up to 5 filtered results as clickable buttons
	for (var i = 0; i < Math.min(filteredOptions.length, 5); i++) {
		var listItem = document.createElement('li');
		listItem.className = 'result-item';
		listItem.textContent = filteredOptions[i].name;

		// Attach a click event listener to each result button
		listItem.addEventListener('click', function () {
			// Display product information when a result is clicked
			var clickedProduct = allProducts.find(product => product.name === this.textContent);
			if (clickedProduct) {
				productDescription.textContent = clickedProduct.description;
				productInfo.style.display = 'block';
			}
		});

		searchResults.appendChild(listItem);
	}

	// Show the results container
	searchResults.style.display = 'block';
}

const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
searchButton.addEventListener('click', showResults);

// Event listener for real-time updates
searchInput.addEventListener('input', function () {
	showResults(); // You can add debounce or delay here for better performance
});

searchInput.addEventListener('focus', function () {
	setAllProducts();
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
	var selectedProduct = event.target.textContent;
	displayProductDetails(selectedProduct);
}

// Function to display details of the selected product
function displayProductDetails(productName) {
	// Here, you can fetch additional details about the product
	// For demonstration purposes, let's just show an alert with the product name
	alert('Selected Product: ' + productName);
}

function setAllProducts() {
	db.findAllProducts((products) => {
		allProducts = products;
		console.log(allProducts);
	});
}

// Event listener for real-time updates
document.getElementById('search-input').addEventListener('input', function () {
	showResults();
});

// Event listener for handling result clicks
document.getElementById('search-results').addEventListener('click', handleResultClick);

// Event listener to close results when clicking outside the search container
document.addEventListener('click', function (event) {
	var searchContainer = document.getElementById('search-container');
	var searchResults = document.getElementById('search-results');

	if (!searchContainer.contains(event.target) && !searchResults.contains(event.target)) {
		searchResults.style.display = 'none';
	}
});
