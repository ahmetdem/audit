import { p_db } from './p_database.js';
import { displayQuestionsAndOptions } from './p_display.js';

let allProducts = [];
let productsLoaded = false;

function fetchProducts(searchInput) {
	// Simulating server-side logic with client-side filtering
	return allProducts.filter(option => option.name.toLowerCase().startsWith(searchInput.toLowerCase()));
}

async function showResults() {
	var searchInput = document.getElementById('search-input').value.toLowerCase();
	var searchResults = document.getElementById('search-results');

	if (!productsLoaded) {
        await setAllProducts();
    }

	// Fetch products from the client-side based on the search input
	var filteredOptions = fetchProducts(searchInput);

	// Clear previous results
	searchResults.innerHTML = '';

	// Display up to 5 filtered results as clickable buttons and sort them alphabetically
	for (var i = 0; i < Math.min(filteredOptions.length, 10); i++) {
		var listItem = document.createElement('li');
		listItem.className = 'result-item';
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

showResults();

function handleResultClick(event) {
    // Remove the 'selected' class from all result items
    document.querySelectorAll('#search-results .result-item').forEach(item => {
        item.classList.remove('selected');
    });

    // Add the 'selected' class to the clicked item
    event.target.classList.add('selected');

    var selectedProduct = event.target.textContent;
    displayProductDetails(selectedProduct);
}


// Function to display details of the selected product
function displayProductDetails(productName) {
	// display the product questions and options using the displayQuestionsAndOptions function
	var selectedProduct = allProducts.find(product => product.name === productName);
	console.log(selectedProduct);
	displayQuestionsAndOptions(selectedProduct);
}

function setAllProducts() {
    return new Promise((resolve) => {
        p_db.findAllProducts((products) => {
            allProducts = products;
            productsLoaded = true;
            console.log(allProducts);
            resolve();  // Resolve the promise once products are loaded
        });
    });
}

// Event listener for real-time updates
document.getElementById('search-input').addEventListener('input', function () {
	showResults();
});

// Event listener for handling result clicks
document.getElementById('search-results').addEventListener('click', handleResultClick);

// // Event listener to close results when clicking outside the search container
// document.addEventListener('click', function (event) {
// 	var searchContainer = document.getElementById('search-container');
// 	var searchResults = document.getElementById('search-results');

// 	if (!searchContainer.contains(event.target) && !searchResults.contains(event.target)) {
// 		searchResults.style.display = 'none';
// 	}
// });