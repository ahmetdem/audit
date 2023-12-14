const Datastore = require('nedb');

export class DatabaseManager {
  constructor() {
    this.db = new Datastore({ filename: './database/database.db', autoload: true });
  }

  insertProduct(product, callback) {
    this.db.insert(product, (insertErr, newDocument) => {
      if (insertErr) {
        console.error(insertErr);
      } else {
        callback(newDocument);
      }
    });
  }

  // find a product by its name and return it
  findProductByName(name, callback) {
    this.db.findOne({ name: name }, (findErr, document) => {
      if (findErr) {
        console.error(findErr);
      } else {
        callback(document ? document : null);
      }
    });
  }

  getAllElements(callback) {
    this.db.find({}, (findErr, document) => {
      if (findErr) {
        console.error(findErr);
      } else {
        callback(document ? document : null);
      }
    });
  }

  resetDatabase() {
    this.db.remove({}, { multi: true }, function (err, numRemoved) {
      if (err) {
        console.error(err);
      }
    });
  }

  getNumberOfElements(callback) {
    this.db.count({}, (countErr, count) => {
      if (countErr) {
        console.error(countErr);
      } else {
        callback(count);
      }
    });
  }
}

export default DatabaseManager;

