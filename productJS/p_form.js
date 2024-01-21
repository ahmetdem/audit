import { Product, Question, Option } from './product.js';
import { p_db } from './p_database.js';

document.addEventListener('DOMContentLoaded', function () {

	const addQuestionButton = document.querySelector('.add-question-button');
	const displayButton = document.querySelector('.display-button');

	addQuestionButton.addEventListener('click', function () {
		const questionsContainer = document.getElementById('questions-container');
		const questionNumber = questionsContainer.querySelectorAll('.form-control').length + 1;
		const newQuestionControl = document.createElement('div');

		newQuestionControl.classList.add('form-control');
		newQuestionControl.innerHTML = `
		<label for="soru-${questionNumber}">Soru ${questionNumber}</label>
		<input type="text" id="soru-${questionNumber}" placeholder="Placeholder" style="display: inline-block; width: calc(90% - 20px); margin-right: 10px;">
		<button type="button" class="remove-question-button" style="display: inline-block;">X</button>
		<div class="options-container"></div>
		<button type="button" class="add-option-button">+</button>`;

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

			// Update the question numbers
			const questions = questionsContainer.querySelectorAll('.form-control');
			questions.forEach(function (question, index) {
				question.querySelector('label').textContent = `Soru ${index + 1}`;
				question.querySelector('input').id = `soru-${index + 1}`;
				question.querySelectorAll('.option-input').forEach(function (optionInput) {
					optionInput.name = `soru-${index + 1}`;
				});
				question.querySelectorAll('.is-true-radio').forEach(function (isTrueRadio) {
					isTrueRadio.name = `is-true-${index + 1}`;
				});
			});
		});
	});

	displayButton.addEventListener('click', function () {
		const inputsInsideFormContainer = document.querySelectorAll('.form-container input');
		let allFilled = true;

		inputsInsideFormContainer.forEach(function (input) {
			if (input.value === '') {
				allFilled = false;
			}

			input.value = input.value.trim();
		});

		if (allFilled) {
			const questionsContainer = document.getElementById('questions-container');
			const questions = questionsContainer.querySelectorAll('.form-control');
			const productName = document.getElementById('product-name').value.trim();

			if (questions.length === 0) {
				alert('Lütfen en az bir soru ekleyiniz!');
				return;
			}

			let validInput = true; // Flag to track the validity of options

			p_db.getNumberOfElements().then((count) => {
				const productID = count + 1;
				const product = new Product(productID, productName);
				let q_id = 0; let hasTrueOption = false;

				questions.forEach(function (question) {
					const questionText = question.querySelector('input[type="text"]').value;
					const options = question.querySelectorAll('.option-input');

					if (options.length < 2) {
						alert('Lütfen her soru için en az iki seçenek ekleyiniz!');
						validInput = false; // Set the flag to false if options are not valid
						return; // Exit the forEach loop early
					}

					let o_id = 0;

					let q = new Question(q_id++, questionText);
					options.forEach(function (option, index) {
						const isTrueCheckbox = question.querySelectorAll('.is-true-radio')[index];
						const isTrue = isTrueCheckbox.checked;
						hasTrueOption = hasTrueOption || isTrue;

						q.addOption(new Option(o_id++, option.value, isTrue));
					});

					if (!hasTrueOption) {
						alert('Lütfen her soru için en az bir doğru seçenek işaretleyiniz!');
						validInput = false; // Set the flag to false if options are not valid
						return; // Exit the forEach loop early
					}

					product.addQuestion(q);
				});

				console.log(p_db.isExistProductByName(productName));

				p_db.isExistProductByName(productName).then((isExist) => {
					if (isExist) {
						alert('Bu ürün zaten var!');
						return;
					} else {
						// Check the flag before proceeding
						if (!validInput) {
							return;
						}

						p_db.insertProduct(product, function (newDocument) {
							console.log(newDocument);
							console.log('Product added successfully!');

							alert('Ürün başarıyla eklendi!');
						});

						// Clear the form
						document.getElementById('product-name').value = '';
						questionsContainer.innerHTML = '';
					}
				});
			});

		} else {
			alert('Lütfen tüm alanları doldurunuz!');
		}
	});
});
