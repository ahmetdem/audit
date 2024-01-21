const Datastore = require('nedb');
import { Product, Question, Option } from './product.js';

export class DatabaseManager {
  constructor() {
    this.db = new Datastore({ filename: './database/products.db', autoload: true });
  }

  insertProduct = (product, callback = () => { }) => {
    this.db.insert(product, (insertErr, newDocument) => {
      if (insertErr) {
        console.error(insertErr);
      } else {
        callback(newDocument);
      }
    });
  }

  // find product by name and return it
  findProductByName(name, callback = () => { }) {
    this.db.findOne({ name: name }, (findErr, document) => {
      if (findErr) {
        console.error(findErr);
      } else {
        callback(document);
      }
    });
  }

  // find product by name and return true if it exists
  isExistProductByName(name) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ name: name }, (findErr, document) => {
        if (findErr) {
          console.error(findErr);
          reject(findErr); // Reject the promise with the error
        } else {
          resolve(document !== null); // Resolve the promise with true if document exists, false otherwise
        }
      });
    });
  }

  findAllProducts(callback = () => { }) {
    this.db.find({}, (findErr, documents) => {
      if (findErr) {
        console.error(findErr);
      } else {
        callback(documents);
      }
    });
  }

  resetDatabase(callback = () => { }) {
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

  updateProductName(product, newName, callback = () => { }) {
    console.log("updateProductName");
    this.db.update({ _id: product._id }, { $set: { name: newName } }, {}, (updateErr, numReplaced) => {
      if (updateErr) {
        console.error(updateErr);
      } else {
        callback(numReplaced);
      }
    });
  }

  updateProductWithId(product, questionId, optionId, newText, isQuestion) {
    return new Promise((resolve, reject) => {
      console.log(`updateProductWithId - ${isQuestion ? 'Question' : 'Option'}`);

      this.db.findOne({ _id: product._id }, (findErr, document) => {
        if (findErr) {
          console.error(findErr);
          reject(findErr);
        } else {
          const questionIndex = document.questions.findIndex(q => q.id === questionId);

          if (isQuestion) {
            // Update question
            if (questionIndex !== -1) {
              document.questions[questionIndex].text = newText;
            } else {
              console.error("Question not found");
              reject(new Error("Question not found"));
              return;
            }
          } else {
            // Update option
            const optionIndex = document.questions[questionIndex].options.findIndex(o => o.id === optionId);
            if (questionIndex !== -1 && optionIndex !== -1) {
              document.questions[questionIndex].options[optionIndex].text = newText;
            } else {
              console.error("Question or option not found");
              reject(new Error("Question or option not found"));
              return;
            }
          }

          // Replace the entire document in the database
          this.db.update({ _id: product._id }, document, {}, (updateErr, numAffected) => {
            if (updateErr) {
              console.error(updateErr);
              reject(updateErr);
            } else {
              resolve(numAffected);
            }
          });
        }
      });
    });
  }


  deleteProduct(product, callback = () => { }) {
    this.db.remove({ _id: product._id }, {}, (removeErr, numRemoved) => {
      if (removeErr) {
        console.error(removeErr);
      } else {
        callback(numRemoved);
      }
    });
  }
}

export const p_db = new DatabaseManager();

