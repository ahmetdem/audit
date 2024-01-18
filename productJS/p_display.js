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

                // Highlight the unanswered question by accessing the question container element
                const questionElement = document.getElementById(question.id);
                if (questionElement) {
                    questionElement.style.backgroundColor = 'red';
                }
            }
        });

        if (!allQuestionsAnswered) {
            alert('Lütfen tüm soruları cevaplayın.\nCevaplanmayan sorular kırmızı renkte gösterilecektir.');
            return;
        }  

        // reset the color of the questions
        g_Product.questions.forEach(question => {
            const questionElement = document.getElementById(question.id);
            if (questionElement) {
                questionElement.style.backgroundColor = '';
            }
        });

        console.log(selectedOptions);

        // Check if the answers are correct
        let allAnswersCorrect = true;

        g_Product.questions.forEach(question => {
            const selectedOptionId = selectedOptions[question.id];
            const selectedOption = question.options.find(option => option.id === selectedOptionId);
            if (!selectedOption.isTrue) {
                allAnswersCorrect = false;
            }
        });

        if (!allAnswersCorrect) {
            alert('Cevaplarınız doğru değil.\nYanlış cevaplar kırmızı renkte gösterilecektir.');
            // log the wrong answers
            g_Product.questions.forEach(question => {
                const selectedOptionId = selectedOptions[question.id];
                const selectedOption = question.options.find(option => option.id === selectedOptionId);
                if (!selectedOption.isTrue) {
                    console.log(`Question: ${question.text}, Answer: ${selectedOption.text}`);
                }
            });


            return;
        }
    });
});