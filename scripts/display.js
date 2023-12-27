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

    product.questions.forEach(question => {
        const questionContainer = document.createElement('div');
        questionContainer.classList.add('question-container');

        const questionElement = document.createElement('p');
        questionElement.textContent = question.text;
        questionContainer.appendChild(questionElement);

        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('options-container');

        question.options.forEach(option => {
            const optionElement = document.createElement('p');
            optionElement.textContent = option.text;

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
    // Check if an option for this question is already selected
    if (selectedOptions[questionId]) {
        // Deselect the previously selected option
        const previousOption = document.getElementById(selectedOptions[questionId]);
        if (previousOption) {
            previousOption.classList.remove('selected');
        }
    }

    // Select the clicked option
    const clickedOption = document.getElementById(optionId);
    if (clickedOption) {
        clickedOption.classList.add('selected');
    }

    // Update the selectedOptions object
    selectedOptions[questionId] = optionId;
}

document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.getElementById('submit-button');

    submitButton.addEventListener('click', function () {

        // Check if all questions are answered 
        let allQuestionsAnswered = true;

        // FIXME 
        g_Product.questions.forEach(question => {
            if (!selectedOptions[question.id]) {
                allQuestionsAnswered = false;
            }
        });

        console.log("allQuestionsAnswered", allQuestionsAnswered);

        if (allQuestionsAnswered) {
            console.log("All questions are answered. Selected options:", selectedOptions);
        } else {
            console.error("Not all questions are answered. Please answer all questions.");
            console.log("Selected options:", selectedOptions);
        }
    });
});
