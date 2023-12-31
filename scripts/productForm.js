import { Product, Question, Option } from './product.js';
import { db } from './database.js';

document.addEventListener('DOMContentLoaded', function () {

	const addQuestionButton = document.querySelector('.add-question-button');
	const displayButton = document.querySelector('.display-button');
	const inputsInsideFormContainer = document.querySelectorAll('#form-container > input');

	addQuestionButton.addEventListener('click', function () {
		const questionsContainer = document.getElementById('questions-container');
		const questionNumber = questionsContainer.querySelectorAll('.form-control').length + 1;
		const newQuestionControl = document.createElement('div');

		newQuestionControl.classList.add('form-control');
		newQuestionControl.innerHTML = `
		<label for="soru-${questionNumber}">Soru ${questionNumber}</label>
		<input type="text" id="soru-${questionNumber}" placeholder="Placeholder">
		<div class="options-container"></div>
		<button type="button" class="add-option-button">+</button>
		<button type="button" class="remove-question-button">X</button>`;

		questionsContainer.appendChild(newQuestionControl);

		const optionsContainer = newQuestionControl.querySelector('.options-container');
		const addOptionButton = newQuestionControl.querySelector('.add-option-button');
		const removeQuestionButton = newQuestionControl.querySelector('.remove-question-button');

		addOptionButton.addEventListener('click', function () {
			const newOptionInput = document.createElement('input');
			newOptionInput.type = 'text';
			newOptionInput.classList.add('option-input');
			newOptionInput.placeholder = 'Seçenek';
			newOptionInput.required = true;
		
			const isTrueRadio = document.createElement('input');
			isTrueRadio.type = 'radio';
			isTrueRadio.classList.add('is-true-radio');
			isTrueRadio.name = `is-true-${questionNumber}`;
		
			const removeOptionButton = document.createElement('button');
			removeOptionButton.type = 'button';
			removeOptionButton.classList.add('remove-option-button');
			removeOptionButton.textContent = '-';
		
			removeOptionButton.addEventListener('click', function () {
				newOptionInput.remove();
				isTrueRadio.remove();
				removeOptionButton.remove();
			});
		
			optionsContainer.appendChild(newOptionInput);
			optionsContainer.appendChild(isTrueRadio);
			optionsContainer.appendChild(removeOptionButton);
		});
		

		removeQuestionButton.addEventListener('click', function () {
			newQuestionControl.remove();
		});
	});
	
	displayButton.addEventListener('click', function () {
		let allFilled = true;

		inputsInsideFormContainer.forEach(function (input) {
			if ( input.value === '' ) {
				allFilled = false;
			}

			input.value = input.value.trim();
		});

		if ( allFilled ) {
			const questionsContainer = document.getElementById('questions-container');
			const questions = questionsContainer.querySelectorAll('.form-control');
			const productName = document.getElementById('product-name').value;

			// get the id by adding 1 to the number of elements in the database
			db.getNumberOfElements().then((count) => {
				const productID = count + 1;
				const product = new Product(productID, productName);
				let q_id = 0

				questions.forEach(function (question) {
					const questionText = question.querySelector('input[type="text"]').value;
					const options = question.querySelectorAll('.option-input');
					let o_id = 0;

					let q = new Question(q_id++, questionText);
					options.forEach(function (option, index) {
						const isTrueCheckbox = question.querySelectorAll('.is-true-radio')[index];
						const isTrue = isTrueCheckbox.checked;
						q.addOption(new Option(o_id++, option.value, isTrue));
					});

					product.addQuestion(q);
				});

				db.insertProduct(product, function (newDocument) {
					console.log(newDocument);
				});
			});
			
		} else {
			alert('Lütfen tüm alanları doldurunuz!');
		}
	});
});
