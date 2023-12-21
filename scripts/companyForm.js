import { Company } from './company.js';

document.addEventListener('DOMContentLoaded', function () {
	const addCompanyButton = document.querySelector('.add-company-button');
	const inputsInsideFormContainer = document.querySelectorAll('#company-form-container > input');

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

			const company = new Company(0, companyName, companyAdress, companyMailAdress, companyFaxNum, companyTaxNum);
			company.displayInfo();
		} else {
			alert('Please fill all the inputs!');
		}

	});
});