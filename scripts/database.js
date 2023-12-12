// src/database.js

const Datastore = require('nedb');

// Initialize the database
export function initDatabase() {
    return new Datastore({ filename: '../database/database.db', autoload: true });
}

// Define a struct-like object for options
class Option {
	constructor(id, text) {
		this.id = id;
		this.text = text;
	}
}

// Define a struct-like object for questions
class Question {
	constructor(id, text, options) {
		this.id = id;
		this.text = text;
		this.options = options || [];
	}
}

// Define a struct-like object for products
export class Product {
	constructor(id, name, questions) {
		this.id = id;
		this.name = name;
		this.questions = questions || [];
	}
}

// Insert a product into the database
export function insertProduct(db, product, callback) {
	db.insert(product, (err, newDocument) => {
		if (err) {
			console.error(err);
		} else {
			callback(newDocument);
		}
	});
}

// Find Questions for a specific product
function findQuestionsForProduct(db, productName, callback) {
	db.findOne({ name: productName }, (findErr, document) => {
		if (findErr) {
			console.error(findErr);
		} else {
			callback(document ? document.questions : null);
		}
	});
}

// Find Options for a specific question based on the id of the question
function findOptionsForQuestion(db, product, questionId, callback) {	
	db.findOne({ name: product }, (findErr, document) => {
		if (findErr) {
			console.error(findErr);
		} else {
			callback(document ? document.questions[questionId].options : null);
		}
	});
}


// get all elements from database
function getAllElements(db, callback) {
	db.find({}, (findErr, document) => {
		if (findErr) {
			console.error(findErr);
		} else {
			callback(document ? document : null);
		}
	});
}

// reset database
function resetDatabase(db) {
	db.remove({}, { multi: true }, function (err, numRemoved) {
	});
}

// find count of elements in database
function findCountOfElements(db, callback) {
	db.count({}, (findErr, document) => {
		if (findErr) {
			console.error(findErr);
		} else {
			callback(document ? document : null);
		}
	});
}

