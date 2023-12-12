// src/database.js

const Datastore = require('nedb');

/**
 * Initializes the database.
 * @returns {Datastore} The initialized database.
 */
export function initDatabase() {
    return new Datastore({ filename: '../database/database.db', autoload: true });
}

// Base class for options
class Option {
   constructor(id, text) {
      this.id = id;
      this.text = text;
   }
}
  
// Class for questions, inheriting from Option
class Question extends Option {
	constructor(id, text, options = []) {
		super(id, text);
		this.options = options.map(option => new Option(option.id, option.text));
	}
}

// Class for products
export class Product {
	constructor(id, name, questions = []) {
		this.id = id;
		this.name = name;
		this.questions = questions.map(question => new Question(question.id, question.text, question.options));
	}
}
  

/**
 * Inserts a product into the database.
 * @param {Datastore} db - The database object.
 * @param {Product} product - The product to be inserted.
 * @param {Function} callback - The callback function to be called after the insertion.
 */
export function insertProduct(db, product, callback) {
	db.insert(product, (err, newDocument) => {
		if (err) {
			console.error(err);
		} else {
			callback(newDocument);
		}
	});
}


/**
 * Finds questions for a specific product in the database.
 * @param {Datastore} db - The database object.
 * @param {string} productName - The name of the product.
 * @param {function} callback - The callback function to be called with the found questions.
 */
function findQuestionsForProduct(db, productName, callback) {
	db.findOne({ name: productName }, (findErr, document) => {
		if (findErr) {
			console.error(findErr);
		} else {
			callback(document ? document.questions : null);
		}
	});
}


/**
 * Finds options for a specific question in the database.
 * @param {Datastore} db - The database object.
 * @param {string} product - The name of the product.
 * @param {number} questionId - The ID of the question.
 * @param {function} callback - The callback function to handle the result.
 */
function findOptionsForQuestion(db, product, questionId, callback) {	
	db.findOne({ name: product }, (findErr, document) => {
		if (findErr) {
			console.error(findErr);
		} else {
			callback(document ? document.questions[questionId].options : null);
		}
	});
}



/**
 * Retrieves all elements from the database.
 * @param {Datastore} db - The database object.
 * @param {Function} callback - The callback function to be called with the retrieved elements.
 */
function getAllElements(db, callback) {
	db.find({}, (findErr, document) => {
		if (findErr) {
			console.error(findErr);
		} else {
			callback(document ? document : null);
		}
	});
}


/**
 * Resets the database by removing all documents.
 * @param {Datastore} db - The database object.
 * @returns {void}
 */
function resetDatabase(db) {
	db.remove({}, { multi: true }, function (err, numRemoved) {
	});
}


/**
 * Finds the count of elements in the database.
 * @param {Datastore} db - The database object.
 * @param {Function} callback - The callback function to be called with the count of elements.
 */
function findCountOfElements(db, callback) {
	db.count({}, (findErr, document) => {
		if (findErr) {
			console.error(findErr);
		} else {
			callback(document ? document : null);
		}
	});
}

