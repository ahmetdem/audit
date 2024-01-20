import { Company } from './company.js';
import { c_db } from './c_database.js';
import { selectedProducts } from './c_p_search.js';
import { companiesState } from './c_search.js';

document.addEventListener('DOMContentLoaded', function () {
    const addCompanyButton = document.querySelector('.add-company-button');
    const inputsInsideFormContainer = document.querySelectorAll('#add-company-form input:not(#search-for-company-products-input)');

    const companyNameInput = document.getElementById('company-name');
    const companyAdressInput = document.getElementById('company-adress');
    const companyMailAdressInput = document.getElementById('company-mail-adress');
    const companyFaxNumInput = document.getElementById('company-fax-number');
    const companyTaxNumInput = document.getElementById('company-tax-number');

    // Function to update localStorage on input change
    function updateLocalStorage() {
        localStorage.setItem('companyName', companyNameInput.value);
        localStorage.setItem('companyAdress', companyAdressInput.value);
        localStorage.setItem('companyMailAdress', companyMailAdressInput.value);
        localStorage.setItem('companyFaxNum', companyFaxNumInput.value);
        localStorage.setItem('companyTaxNum', companyTaxNumInput.value);
    }

    // Retrieve values from localStorage and populate the form
    companyNameInput.value = localStorage.getItem('companyName') || '';
    companyAdressInput.value = localStorage.getItem('companyAdress') || '';
    companyMailAdressInput.value = localStorage.getItem('companyMailAdress') || '';
    companyFaxNumInput.value = localStorage.getItem('companyFaxNum') || '';
    companyTaxNumInput.value = localStorage.getItem('companyTaxNum') || '';

    // Add input event listeners to update localStorage in real-time
    inputsInsideFormContainer.forEach(function (input) {
        input.addEventListener('input', updateLocalStorage);
    });

    addCompanyButton.addEventListener('click', function () {
        let allFilled = true;

        inputsInsideFormContainer.forEach(function (input) {
            if (input.value === '') {
                allFilled = false;
            }
        });

        if (allFilled) {
            const companyName = companyNameInput.value;
            const companyAdress = companyAdressInput.value;
            const companyMailAdress = companyMailAdressInput.value;
            const companyFaxNum = companyFaxNumInput.value;
            const companyTaxNum = companyTaxNumInput.value;

            if (c_db.findCompanyByName(companyName, (document) => {
                if (document) {
                    alert('This company already exists!');
                    return;
                }
            }));

            c_db.getNumberOfElements().then((count) => {
                const company = new Company(count + 1, companyName, companyAdress,
                    companyMailAdress, companyFaxNum, companyTaxNum, [...selectedProducts]);

                c_db.insertCompany(company, function (newDocument) {
                    console.log('New company added to database: ', newDocument);

                    // Reset values in localStorage after successful insertion
                    localStorage.removeItem('companyName');
                    localStorage.removeItem('companyAdress');
                    localStorage.removeItem('companyMailAdress');
                    localStorage.removeItem('companyFaxNum');
                    localStorage.removeItem('companyTaxNum');

                    selectedProducts.length = 0;

                    inputsInsideFormContainer.forEach(function (input) {
                        input.value = '';
                    });
                });
            });
        } else {
            alert('Please fill all the inputs!');
        }

        companiesState.companiesLoaded = false;
        location.reload();
    });
});