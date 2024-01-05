import { Company } from './company.js';
import { c_db } from './c_database.js';
import { selectedProducts } from './c_p_search.js';

document.addEventListener('DOMContentLoaded', function () {
	const addCompanyButton = document.querySelector('.add-company-button');
	const inputsInsideFormContainer = document.querySelectorAll('#add-company-form input:not(#search-for-company-products-input)');

	addCompanyButton.addEventListener('click', function () {
		let allFilled = true;

		inputsInsideFormContainer.forEach(function (input) {
			if ( input.value === '' ) {
				allFilled = false;
			}
		});

		if ( allFilled ) {
			const companyName = document.getElementById('company-name').value;
			const companyAdress = document.getElementById('company-adress').value;
			const companyMailAdress = document.getElementById('company-mail-adress').value;
			const companyFaxNum = document.getElementById('company-fax-number').value;
			const companyTaxNum = document.getElementById('company-tax-number').value;

			c_db.getNumberOfElements().then((count) => {
				const company = new Company(count + 1, companyName, companyAdress, 
					companyMailAdress, companyFaxNum, companyTaxNum, [...selectedProducts]);
				
				c_db.insertCompany(company, function (newDocument) {
					console.log('New company added to database: ', newDocument);
				});

				selectedProducts.length = 0;

				inputsInsideFormContainer.forEach(function (input) {
					input.value = '';
				});
			});

		} else {
			alert('Please fill all the inputs!');
		}
	});
});