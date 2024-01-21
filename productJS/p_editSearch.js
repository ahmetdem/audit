import { p_db } from './p_database.js';
import { displayQuestionsAndOptions } from './p_edit.js';

let allProducts = [];
var currentSelectedProduct = null;

export const productsState = {
    productsLoaded: false
};

function fetchProducts(searchInput) {
    // Simulating server-side logic with client-side filtering
    return allProducts.filter(option => option.name.toLowerCase().startsWith(searchInput.toLowerCase()));
}

export async function showResults() {
    var searchInputValue = document.getElementById('search-input').value.toLowerCase();
    var searchResults = document.getElementById('search-results');

    await setAllProducts();

    // Fetch products from the client-side based on the search input
    var filteredOptions = fetchProducts(searchInputValue);

    // Clear previous results
    searchResults.innerHTML = '';


    // Display up to 10 filtered results as clickable buttons and sort them alphabetically
    for (var i = 0; i < filteredOptions.length; i++) {
        var listItem = document.createElement('li');
        listItem.className = 'result-item';
        listItem.textContent = filteredOptions[i].name;

        if (filteredOptions[i].name === currentSelectedProduct) {
            listItem.classList.add('selected');
        }

        searchResults.appendChild(listItem);
    }

    // Show the results container
    searchResults.style.display = 'block';

    console.log(filteredOptions);
}

// Event listener for real-time updates
document.getElementById('search-input').addEventListener('input', function () {
    showResults(); // You can add debounce or delay here for better performance
});

function handleResultClick(event) {
    var selectedProduct = event.target.textContent;

    if (selectedProduct === currentSelectedProduct) {
        return;
    }

    var previousSelectedProduct = document.querySelector('#search-results .selected');
    if (previousSelectedProduct) {
        previousSelectedProduct.classList.remove('selected');
    }

    // Add the 'selected' class to the clicked item
    event.target.classList.add('selected');
    currentSelectedProduct = selectedProduct;

    displayProductDetails(selectedProduct);
}

// Function to display details of the selected product
function displayProductDetails(productName) {
    // display the product questions and options using the displayQuestionsAndOptions function
    var selectedProduct = allProducts.find(product => product.name === productName);
    displayQuestionsAndOptions(selectedProduct);
}

function setAllProducts() {
    return new Promise((resolve) => {
        p_db.findAllProducts((products) => {
            allProducts = products;
            productsState.productsLoaded = true;
            resolve();  // Resolve the promise once products are loaded
        });
    });
}

// Event listener for handling result clicks
document.getElementById('search-results').addEventListener('click', handleResultClick);

// Initial call to showResults
showResults();
