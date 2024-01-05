export function displayCompanyInfo(company) {
    const container = document.getElementById('company-info-container');
    container.innerHTML = ''; // Clear the container

    const companyContainer = document.createElement('div');
    companyContainer.classList.add('company-info-container');
    companyContainer.id = company.id; // Set the id of the companyContainer

    const companyNameElement = document.createElement('p');
    companyNameElement.textContent = `Company Name: ${company.name}`;
    companyContainer.appendChild(companyNameElement);

    const companyAddressElement = document.createElement('p');
    companyAddressElement.textContent = `Company Address: ${company.adress}`;
    companyContainer.appendChild(companyAddressElement);

    const companyMailElement = document.createElement('p');
    companyMailElement.textContent = `Company Mail Address: ${company.mailAdress}`;
    companyContainer.appendChild(companyMailElement);

    const companyFaxElement = document.createElement('p');
    companyFaxElement.textContent = `Company Fax Number: ${company.faxNum}`;
    companyContainer.appendChild(companyFaxElement);

    const companyTaxElement = document.createElement('p');
    companyTaxElement.textContent = `Company Tax Number: ${company.taxNum}`;
    companyContainer.appendChild(companyTaxElement);

    // Display the products
    const productsContainer = document.createElement('div');
    productsContainer.classList.add('products-container');
    company.products.forEach(product => {
        const productElement = document.createElement('p');
        productElement.textContent = `Product: ${product}`;
        productsContainer.appendChild(productElement);
    });

    companyContainer.appendChild(productsContainer);
    container.appendChild(companyContainer);
}
