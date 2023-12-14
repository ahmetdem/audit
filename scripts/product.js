export class Product {
	constructor(id, name, questions = []) {
		this.id = id;
		this.name = name;
		this.questions = questions.map(question => new Question(question.id, question.text, question.options));
	}

	// Method to add a new question to the product
	addQuestion(question) {
		const newQuestion = new Question(question.id, question.text, question.options);
		this.questions.push(newQuestion);
	}

	// Method to display product information
	displayInfo() {
		console.log(`Product ID: ${this.id}`);
		console.log(`Product Name: ${this.name}`);
		console.log('Questions:');
		this.questions.forEach(question => {
			console.log(`  Question ID: ${question.id}`);
			console.log(`  Question Text: ${question.text}`);
			console.log('  Options:');
			question.options.forEach(option => {
				console.log(`    Option ID: ${option.id}, Option Text: ${option.text}`);
			});
		});
	}

}

class Question {
	constructor(id, text, options = []) {
		this.id = id;
		this.text = text;
		this.options = options.map(option => new Option(option.id, option.text));
	}

	// Method to add a new option to the question
	addOption(option) {
		const newOption = new Option(option.id, option.text);
		this.options.push(newOption);
	}
}

class Option {
	constructor(id, text) {
		this.id = id;
		this.text = text;
	}
}