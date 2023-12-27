const Datastore = require('nedb');
import { Product, Question, Option } from './product.js';

export class DatabaseManager {
  constructor() {
    this.db = new Datastore({ filename: './database/database.db', autoload: true });
  }

  insertProduct = (product, callback = () => {}) => {
    this.db.insert(product, (insertErr, newDocument) => {
      if (insertErr) {
        console.error(insertErr);
      } else {
        callback(newDocument);
      }
    });
  }

  // find product by name and return it
  findProductByName(name, callback = () => {}) {
    this.db.findOne({ name: name }, (findErr, document) => {
      if (findErr) {
        console.error(findErr);
      } else {
        callback(document);
      }
    });
  }

  findAllProducts(callback = () => {}) {
    this.db.find({}, (findErr, documents) => {
      if (findErr) {
        console.error(findErr);
      } else {
        callback(documents);
      }
    });
  }

  resetDatabase(callback = () => {} ) {
    this.db.remove({}, { multi: true }, function (err, numRemoved) {
      if (err) {
        console.error(err);
      } else {
        callback(numRemoved);
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

  updateProduct(product, callback = () => {}) {
    this.db.update({ _id: product._id }, product, {}, (updateErr, numReplaced) => {
      if (updateErr) {
        console.error(updateErr);
      } else {
        callback(numReplaced);
      }
    });
  }

  deleteProduct(product, callback = () => {}) {
    this.db.remove({ _id: product._id }, {}, (removeErr, numRemoved) => {
      if (removeErr) {
        console.error(removeErr);
      } else {
        callback(numRemoved);
      }
    });
  }
}

export const db = new DatabaseManager();