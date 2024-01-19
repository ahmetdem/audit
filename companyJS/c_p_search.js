import { p_db } from '../productJS/p_database.js';

let allProduct = [];
let productLoaded = false;

export const selectedProducts = [];

function fetchProducts(searchInput) {
	// Simulating server-side logic with client-side filtering
	return allProduct.filter(option => option.name.toLowerCase().startsWith(searchInput.toLowerCase()));
}

async function showResults() {
    var searchInput = document.getElementById('search-for-company-products-input').value.toLowerCase();
    var searchResults = document.getElementById('product-search-results');

    if (!productLoaded) {
        await setAllProduct();
    }

    // Fetch products from the client-side based on the search input
    var filteredOptions = fetchProducts(searchInput);

    // Clear previous results
    searchResults.innerHTML = '';

    // Display all the filtered results as clickable buttons and sort them alphabetically
    for (var i = 0; i < filteredOptions.length; i++) {
        var listItem = document.createElement('li');
        listItem.className = 'result-item-product';
        listItem.textContent = filteredOptions[i].name;

        if (selectedProducts.includes(filteredOptions[i].name)) {
            listItem.classList.add('selected-item');
        }

        searchResults.appendChild(listItem);
    }

    // Show the results container
    searchResults.style.display = 'block';
}

const searchInput = document.getElementById('search-for-company-products-input');

// Event listener for real-time updates
searchInput.addEventListener('input', function () {
	showResults(); // You can add debounce or delay here for better performance
});

searchInput.addEventListener('focus', function () {
	showResults();
});

function handleResultClick(event) {
    var selectedProductName = event.target.textContent;
    var selectedProductIndex = selectedProducts.indexOf(selectedProductName);

    if (selectedProductIndex === -1) {
        // Product is not in the array, add it
        selectedProducts.push(selectedProductName);
        event.target.classList.add('selected-item'); // Add a class for highlighting
    } else {
        // Product is already in the array, remove it
        selectedProducts.splice(selectedProductIndex, 1);
        event.target.classList.remove('selected-item'); // Remove the class for highlighting
    }

    console.log('Selected Products:', selectedProducts);
}

function setAllProduct() {
    return new Promise((resolve) => {
        p_db.findAllProducts((Product) => {
            allProduct = Product;
            productLoaded = true;
            console.log(allProduct);
            resolve();  // Resolve the promise once products are loaded
        });
    });
}

// Event listener for real-time updates
document.getElementById('search-for-company-products-input').addEventListener('input', function () {
	showResults();
});

// Event listener for handling result clicks
document.getElementById('product-search-results').addEventListener('click', handleResultClick);