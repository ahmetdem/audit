import { Product } from '../productJS/product.js';
import { p_db } from '../productJS/p_database.js';

document.addEventListener('DOMContentLoaded', function () {

  const getProductButton = document.getElementById('getProductButton');
  const resetDatabaseButton = document.getElementById('resetDatabaseButton');

  resetDatabaseButton.addEventListener('click', function () {
    p_db.resetDatabase();
    showMessage('Database was reset successfully!', 'green');
  });

  getProductButton.addEventListener('click', function () {
    const productName = document.getElementById('productNameToGet').value;

    p_db.findProductByName(productName, (document) => {
      if (document) {
        showMessage(`Product ${document.name} was found!`, 'green');
        const product = new Product(document.id, document.name, document.questions);
        product.displayInfo();
      } else {
        showMessage(`Product ${productName} was not found!`, 'red');
      }
    });
  });
});

function showMessage(message, color) {
  const messageContainer = document.getElementById('message-container');
  messageContainer.textContent = message;
  messageContainer.style.color = color;
}