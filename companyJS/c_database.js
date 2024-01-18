const Datastore = require('nedb');

export class compDatabaseManager {
	constructor() {
		this.db = new Datastore({ filename: './database/companies.db', autoload: true });
	}

	insertCompany = (company, callback = () => { }) => {
		this.db.insert(company, (insertErr, newDocument) => {
			if (insertErr) {
				console.error(insertErr);
			} else {
				callback(newDocument);
			}
		});
	}

	// get all companies
	findAllCompanies(callback = () => { }) {
		this.db.find({}, (findErr, documents) => {
			if (findErr) {
				console.error(findErr);
			} else {
				callback(documents);
			}
		});
	}

	// find company by name and return it
	findCompanyByName(name, callback = () => { }) {
		this.db.findOne({ name: name }, (findErr, document) => {
			if (findErr) {
				console.error(findErr);
			} else {
				callback(document);
			}
		});
	}

	getNumberOfElements() {
		return new Promise((resolve, reject) => {
			this.db.count({}, (err, count) => {
				if (err) {
					console.error(err);
					reject(err);
				} else {
					resolve(count);
				}
			});
		});
	}

	// add product to company
	addProductToCompany(company, product, callback = () => { }) {
		this.db.update({ name: company.name }, { $push: { products: product } }, {}, (updateErr, numUpdated) => {
			if (updateErr) {
				console.error(updateErr);
			} else {
				callback(numUpdated);
			}
		});
	}

	getAllProductsFromCompany(company, callback = () => { }) {
		this.db.findOne({ name: company.name }, (findErr, document) => {
			if (findErr) {
				console.error(findErr);
			} else {
				callback(document.products);
			}
		});
	}
}

export const c_db = new compDatabaseManager();