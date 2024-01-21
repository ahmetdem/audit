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

let initialCompany = null;

function displayCompanyInfo(company) {
	const container = document.getElementById('company-info-container');
	container.style.display = 'block';
	container.innerHTML = ''; // Clear the container

	const companyContainer = document.createElement('div');
	companyContainer.classList.add('company-info-container');
	companyContainer.id = company.id; // Set the id of the companyContainer

	initialCompany = { ...company };

	const companyNameElement = createEditableElement(`Ad: ${company.name}`);
	companyContainer.appendChild(companyNameElement);

	const companyAddressElement = createEditableElement(`Adres: ${company.address}`);
	companyContainer.appendChild(companyAddressElement);

	const companyMailElement = createEditableElement(`Mail Adresi: ${company.mailAddress}`);
	companyContainer.appendChild(companyMailElement);

	const companyFaxElement = createEditableElement(`Faks No: ${company.faxNum}`);
	companyContainer.appendChild(companyFaxElement);

	const companyTaxElement = createEditableElement(`Vergi No: ${company.taxNum}`);
	companyContainer.appendChild(companyTaxElement);

	// Display the products with a comma between them
	const productsContainer = createEditableElement(`Ürünler: ${company.products.join(', ')}`);
	companyContainer.appendChild(productsContainer);

	container.appendChild(companyContainer);
}

function createEditableElement(text) {
	const container = document.createElement('div');

	const paragraph = document.createElement('p');
	paragraph.textContent = text;

	const input = document.createElement('input');
	input.style.display = 'none'; // Initially hide input element

	// Add click event listener to the paragraph
	paragraph.addEventListener('dblclick', () => {
		toggleEditMode(paragraph, input, text);
	});

	container.appendChild(paragraph);
	container.appendChild(input);

	return container;
}

function toggleEditMode(textElement, inputElement, originalText) {
	// Define the handleKeyDown function
	function handleKeyDown(event) {
		if (event.key === 'Enter') {
			// Confirm changes on Enter key
			exitEditMode(textElement, inputElement, originalText, handleKeyDown);
		} else if (event.key === 'Escape') {
			// Cancel edit mode on Escape key
			cancelEditMode(textElement, inputElement, originalText, handleKeyDown);
		}
	}

	// Define the handleOutsideClick function
	function handleOutsideClick(event) {
		// Check if the click is outside the input element
		if (!inputElement.contains(event.target)) {
			cancelEditMode(textElement, inputElement, originalText, handleKeyDown);
			// Remove the click event listener from the document body
			document.body.removeEventListener('click', handleOutsideClick);
		}
	}

	if (textElement.style.display === 'block' || textElement.style.display === '') {
		// Entering edit mode
		textElement.style.display = 'none';
		inputElement.value = originalText;
		inputElement.style.display = 'block';

		inputElement.style.width = '100%';
		inputElement.style.height = '30px';

		inputElement.focus(); // Set focus to the input

		// Add the keydown event listener
		inputElement.addEventListener('keydown', handleKeyDown);

		// Add the click event listener to the document body
		document.body.addEventListener('click', handleOutsideClick);
	} else {
		// Exiting edit mode
		exitEditMode(textElement, inputElement, originalText, handleKeyDown);
	}
}

function exitEditMode(textElement, inputElement, originalText, handleKeyDown, id) {
    const updatedText = inputElement.value.trim();

    if (updatedText !== originalText) {
        originalText = updatedText;
        textElement.textContent = updatedText;

        // Create the updatedCompany object
        const updatedCompany = {
            name: initialCompany.name,
            address: initialCompany.address,
            mailAdress: initialCompany.mailAdress,
            faxNum: initialCompany.faxNum,
            taxNum: initialCompany.taxNum,
            products: [...initialCompany.products], // Ensure a copy to avoid modifying the original array
        };

        const elements = document.querySelectorAll('.company-info-container p');
        elements.forEach(element => {
            const textContent = element.textContent;
            const identifier = textContent.split(': ')[0];

            switch (identifier) {
                case 'Ad':
                    updatedCompany.name = textContent.split(': ')[1];
                    break;
                case 'Adres':
                    updatedCompany.address = textContent.split(': ')[1];
                    break;
                case 'Mail Adresi':
                    updatedCompany.mailAdress = textContent.split(': ')[1];
                    break;
                case 'Faks No':
                    updatedCompany.faxNum = textContent.split(': ')[1];
                    break;
                case 'Vergi No':
                    updatedCompany.taxNum = textContent.split(': ')[1];
                    break;
                case 'Ürünler':
                    updatedCompany.products = textContent.split(': ')[1].split(',').map(item => item.trim());
                    break;
                default:
                    break;
            }
        });

        // Call your updateCompanyInfo function
        c_db.updateCompanyInfo(initialCompany.id, updatedCompany)
            .then(() => {
				console.log('Company updated successfully');

				companiesState.companiesLoaded = false;
				showResults();
			});
    }

    // Common logic for both cases
    textElement.style.display = 'block';
    inputElement.style.display = 'none';
    inputElement.style.width = '';

    // Remove the keydown event listener
    inputElement.removeEventListener('keydown', handleKeyDown);
}


function cancelEditMode(textElement, inputElement, originalText, handleKeyDown) {
	// Revert changes and exit edit mode
	textElement.style.display = 'block';
	inputElement.style.display = 'none';
	inputElement.style.width = ''; // Reset width

	// Remove the keydown event listener
	inputElement.removeEventListener('keydown', handleKeyDown);
}


