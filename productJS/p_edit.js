import { p_db } from "./p_database.js";
import { productsState } from './p_editSearch.js';

let g_product = null;

export function displayQuestionsAndOptions(product) {
    const container = document.getElementById('questions-container');
    container.innerHTML = ''; // Clear the container

    g_product = product;

    product.questions.forEach(question => {
        const questionContainer = document.createElement('div');
        questionContainer.classList.add('question-container');
        questionContainer.id = question.id; // Set the id of the questionContainer

        const questionElement = document.createElement('p');
        questionElement.textContent = question.text;
        questionElement.style.display = 'block'; // Initially show text element

        const questionInput = document.createElement('input');
        questionInput.style.display = 'none'; // Initially hide input element

        // Add click event listener to the question text
        questionElement.addEventListener('dblclick', () => {
            toggleEditMode(questionElement, questionInput, question.text, question.id, null, true);
        });

        questionContainer.appendChild(questionElement);
        questionContainer.appendChild(questionInput); // Append input element to container

        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('options-container');

        question.options.forEach(option => {
            const optionElement = document.createElement('p');
            optionElement.textContent = option.text;
            optionElement.style.display = 'block'; // Initially show text element

            const optionInput = document.createElement('input');
            optionInput.style.display = 'none'; // Initially hide input element

            // Add click event listener to each option
            optionElement.addEventListener('dblclick', () => {
                toggleEditMode(optionElement, optionInput, option.text, question.id, option.id, false);
            });

            optionsContainer.appendChild(optionElement);
            optionsContainer.appendChild(optionInput); // Append input element to container
        });

        questionContainer.appendChild(optionsContainer);
        container.appendChild(questionContainer);
    });
}

function toggleEditMode(textElement, inputElement, originalText, questionId, optionId, isQuestion) {
    // Define the handleKeyDown function
    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            // Confirm changes on Enter key
            exitEditMode(textElement, inputElement, originalText, questionId, optionId, isQuestion, handleKeyDown);
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
        inputElement.focus(); // Set focus to the input

        // Add the keydown event listener
        inputElement.addEventListener('keydown', handleKeyDown);

        // Add the click event listener to the document body
        document.body.addEventListener('click', handleOutsideClick);
    } else {
        // Exiting edit mode
        exitEditMode(textElement, inputElement, originalText, questionId, optionId, isQuestion, handleKeyDown);
    }
}

function exitEditMode(textElement, inputElement, originalText, questionId, optionId, isQuestion, handleKeyDown) {
    const updatedText = inputElement.value.trim();
    if (updatedText !== originalText) {
        if (isQuestion) {
            p_db.updateProductQuestionWithId(g_product, questionId, updatedText);
        } else {
            p_db.updateProductOptionWithId(g_product, questionId, optionId, updatedText);
        }

        productsState.productsLoaded = false;
        originalText = updatedText;
    }
    textElement.textContent = updatedText;
    textElement.style.display = 'block';
    inputElement.style.display = 'none';

    // Remove the keydown event listener
    inputElement.removeEventListener('keydown', handleKeyDown);
}

function cancelEditMode(textElement, inputElement, originalText, handleKeyDown) {
    // Revert changes and exit edit mode
    textElement.style.display = 'block';
    inputElement.style.display = 'none';

    // Remove the keydown event listener
    inputElement.removeEventListener('keydown', handleKeyDown);
}
