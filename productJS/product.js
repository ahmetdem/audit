/**
 * Represents a Product with questions and options.
 * @class
 */
export class Product {
    /**
     * Constructor to initialize a Product.
     * @constructor
     * @param {number} id - The unique identifier for the product.
     * @param {string} name - The name of the product.
     * @param {Array} questions - An array of question objects associated with the product. Defaults to an empty array.
     */
    constructor(id, name, questions = []) {
        this.id = id;
        this.name = name;
        this.questions = questions.map(question => new Question(question.id, question.text, question.options));
    }

    /**
     * Method to add a new question to the product.
     * @method
     * @param {Object} question - An object representing the question to be added.
     */
    addQuestion(questions) {
        this.questions.push(questions);
    }

    /**
     * Method to display product information.
     * @method
     */
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

/**
 * Represents a Question with options.
 * @class
 */
export class Question {
    /**
     * Constructor to initialize a Question.
     * @constructor 
     * @param {number} id - The unique identifier for the question.
     * @param {string} text - The text of the question.
     * @param {Array} options - An array of option objects associated with the question. Defaults to an empty array.
     */
    constructor(id, text) {
        this.id = id;
        this.text = text;
        this.options = [];
    }

    /**
     * Method to add a new option to the question.
     * @method
     * @param {Object} option - An object representing the option to be added.
     */
    addOption(option) {
        this.options.push(option);
    }
}

/**
 * Represents an Option.
 * @class
 */
export class Option {
    /**
     * Constructor to initialize an Option.
     * @constructor
     * @param {number} id - The unique identifier for the option.
     * @param {string} text - The text of the option.
     * @param {boolean} isTrue - If the option is True
     */
    constructor(id, text, isTrue = false) {
        this.id = id;
        this.text = text;
        this.isTrue = isTrue;
    }
}

