const fs = require('fs');
const path = require('path');

import { g_Company } from '../companyJS/searchCForP.js';

// Initialize an object to store selected options
const selectedOptions = {};
let g_Product;

export function displayQuestionsAndOptions(product) {
    const container = document.getElementById('questions-container');
    container.innerHTML = ''; // Clear the container
    g_Product = product;

    // Clear the selectedOptions object
    Object.keys(selectedOptions).forEach(key => {
        delete selectedOptions[key];
    });

    // Create input fields for firm questions
    const firmNameInput = document.createElement('input');
    firmNameInput.type = 'text';
    firmNameInput.placeholder = 'Firma Adı Giriniz';
    container.appendChild(firmNameInput);

    const storeNameInput = document.createElement('input');
    storeNameInput.type = 'text';
    storeNameInput.placeholder = 'Şube Adı Giriniz';
    container.appendChild(storeNameInput);

    product.questions.forEach(question => {
        const questionContainer = document.createElement('div');
        questionContainer.classList.add('question-container');
        questionContainer.id = question.id; // Set the id of the questionContainer

        const questionElement = document.createElement('p');
        questionElement.textContent = question.text;
        questionContainer.appendChild(questionElement);

        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('options-container');

        question.options.forEach(option => {
            const optionElement = document.createElement('p');
            optionElement.textContent = option.text;

            // Set a unique ID for each option based on question and option IDs
            optionElement.id = `option-${question.id}-${option.id}`;

            // Add click event listener to each option
            optionElement.addEventListener('click', () => {
                handleOptionClick(question.id, option.id);
            });

            optionsContainer.appendChild(optionElement);
        });

        questionContainer.appendChild(optionsContainer);
        container.appendChild(questionContainer);
    });
}

// Function to handle the click on an option
function handleOptionClick(questionId, optionId) {
    // Get the clicked option
    const clickedOption = document.getElementById(`option-${questionId}-${optionId}`);

    // Check if the clicked option is already selected
    const isAlreadySelected = clickedOption.classList.contains('selected');

    // Deselect all options for the current question
    const questionOptions = document.querySelectorAll(`[id^=option-${questionId}]`);
    questionOptions.forEach(optionElement => {
        optionElement.classList.remove('selected');
    });

    // Toggle the selection for the clicked option
    if (!isAlreadySelected) {
        clickedOption.classList.add('selected');
        // Update the selectedOptions object
        selectedOptions[questionId] = optionId;
    } else {
        // If already selected, deselect
        // Update the selectedOptions object to indicate no selection for this question
        selectedOptions[questionId] = null;
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.getElementById('submit-button');

    submitButton.addEventListener('click', function () {

        // Check if all questions are answered 
        let allQuestionsAnswered = true;

        g_Product.questions.forEach(question => {

            if (!selectedOptions.hasOwnProperty(question.id)) {
                allQuestionsAnswered = false;
            }
        });

        if (!allQuestionsAnswered) {
            alert('Lütfen tüm soruları cevaplayın.');
            return;
        }

        console.log(selectedOptions);

        // Check if the answers are correct
        let allAnswersCorrect = true;

        g_Product.questions.forEach(question => {
            const selectedOptionId = selectedOptions[question.id];
            const selectedOption = question.options.find(option => option.id === selectedOptionId);
            if (!selectedOption.isTrue) {
                allAnswersCorrect = false; // Do not forget to use this somewhere
            }
        });

        // If all answers are correct, log the firm and store names
        const firmName = document.querySelector('#questions-container input:nth-child(1)').value;
        const storeName = document.querySelector('#questions-container input:nth-child(2)').value;

        if (firmName === '' || storeName === '') {
            alert('Lütfen firm ve mağaza isimlerini girin.');
            return;
        }

        console.log(`Firm Name: ${firmName}`);
        console.log(`Store Name: ${storeName}`);

        // Log the correct answers
        g_Product.questions.forEach(question => {
            const selectedOptionId = selectedOptions[question.id];
            const selectedOption = question.options.find(option => option.id === selectedOptionId);
            console.log(`Question: ${question.text}, Answer: ${selectedOption.text}`);
        });

        createFinalForm(g_Product.name, firmName, storeName, selectedOptions, g_Product);
    });
});


function createFinalForm(productName, firmName, storeName, selectedOptions, product) {
    // Read the template content based on the product name
    const templateFolderPath = path.join(__dirname, 'templates');
    const templateFileName = `${productName}.txt`.toLowerCase();
    const templateFilePath = path.join(templateFolderPath, templateFileName);

    // Get the user's Documents folder path
    const documentsFolderPath = path.join(process.env.HOME || process.env.USERPROFILE, 'Documents');
    const formsFolderPath = path.join(documentsFolderPath, 'forms');

    alert(templateFolderPath)

    if (!fs.existsSync(templateFilePath)) {
        console.error(`Template file for ${productName} not found.`);
        
        // write the form content to the text file
        const formContent = `Firma Adı: ${firmName}\nMağaza Adı: ${storeName}\n\n`;
        const fileName = `form-for-${productName}-and-${firmName}.txt`;
        const filePath = path.join(formsFolderPath, fileName);

        fs.writeFileSync(filePath, formContent);
        console.log(`Form content written to ${filePath}`);

        alert('Form Başarıyla Oluşturuldu!');

        return;
    }

    const templateContent = fs.readFileSync(templateFilePath, 'utf-8');

    // Replace placeholders with actual values
    let formContent = templateContent
        .replace('{firm-name}', firmName)
        .replace('{store-name}', storeName);

    // Replace placeholders for each question's selected option text and correct option
    product.questions.forEach((question, index) => {
        const selectedOptionId = selectedOptions[question.id];
        const selectedOption = question.options.find(option => option.id === selectedOptionId);
        const correctOption = question.options.find(option => option.isTrue);

        formContent = formContent
            .replace(`{question-${index + 1}-selected-option}`, selectedOption.text)
            .replace(`{question-${index + 1}-correct-option}`, correctOption.text);
    });

    // Create the forms folder path


    // Create the forms folder if it doesn't exist
    if (!fs.existsSync(formsFolderPath)) {
        fs.mkdirSync(formsFolderPath);
    }

    // Create the file name and path
    const fileName = `form-for-${productName}-and-${firmName}.txt`;
    const filePath = path.join(formsFolderPath, fileName);

    // Write the form content to the text file
    fs.writeFileSync(filePath, formContent);
    console.log(`Form content written to ${filePath}`);

    alert('Form Başarıyla Oluşturuldu!');
}