import { p_db } from "./p_database.js";

// Initialize an object to store selected options
const selectedOptions = {};
let g_Product;

export function displayQuestionsAndOptions(product) {
    const container = document.getElementById('questions-container');
    container.innerHTML = ''; // Clear the container
	
	g_Product = product;
    console.log(g_Product);


    // Clear the selectedOptions object
    Object.keys(selectedOptions).forEach(key => {
        delete selectedOptions[key];
    });

    product.questions.forEach(question => {
        const questionContainer = document.createElement('div');
        questionContainer.classList.add('question-container');
        questionContainer.id = question.id; // Set the id of the questionContainer

        const questionElement = document.createElement('p');
        questionElement.textContent = question.text;

        // Add click event listener to the question text
        questionElement.addEventListener('click', () => {
			console.log("question id = " + question.id);
			editQuestion(question.id);
        });

        questionContainer.appendChild(questionElement);

        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('options-container');

        question.options.forEach(option => {
            const optionElement = document.createElement('p');
            optionElement.textContent = option.text;

            // Add click event listener to each option
            optionElement.addEventListener('click', () => {
                console.log("option id = " + option.id);
				editOption(question.id, option.id);
            });

            optionsContainer.appendChild(optionElement);
        });

        questionContainer.appendChild(optionsContainer);
        container.appendChild(questionContainer);
    });
}

function editQuestion(questionId) {
    const question = g_Product.questions.find(question => question.id === questionId);
    const questionText = question.text;

    const form = document.getElementById('edit-form');
    const input = document.getElementById('edit-input');

    input.value = questionText;
    form.style.display = 'block';

    form.onsubmit = function(e) {
        e.preventDefault();

        const newQuestionText = input.value;
        if (newQuestionText !== null && newQuestionText !== '') {
            // Update the question text
            question.text = newQuestionText;
            // Update the question text in the DOM
            const questionElement = document.getElementById(questionId);
            questionElement.textContent = newQuestionText;
        }

        p_db.updateProduct(g_Product);
        form.style.display = 'none';
    }
}

function editOption(questionId, optionId) {
    const question = g_Product.questions.find(question => question.id === questionId);
    const option = question.options.find(option => option.id === optionId);
    const optionText = option.text;

    const form = document.getElementById('edit-form');
    const input = document.getElementById('edit-input');

    input.value = optionText;
    form.style.display = 'block';

    form.onsubmit = function(e) {
        e.preventDefault();

        const newOptionText = input.value;
        if (newOptionText !== null && newOptionText !== '') {
            // Update the option text
            option.text = newOptionText;
            // Update the option text in the DOM
            const optionElement = document.getElementById(optionId);
            optionElement.textContent = newOptionText;
        }

        p_db.updateProduct(g_Product);
        form.style.display = 'none';
    }
}