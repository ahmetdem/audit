import { DatabaseManager } from './database.js';
import { Product, Question, Option } from './product.js';

const db = new DatabaseManager();

document.addEventListener('DOMContentLoaded', function () {
  const addQuestionButton = document.getElementById('addQuestionButton');
  const addOptionButton = document.getElementById('addOptionButton');
  const addProductButton = document.getElementById('addProductButton');
  const getProductButton = document.getElementById('getProductButton');
  const resetDatabaseButton = document.getElementById('resetDatabaseButton');


  addQuestionButton.addEventListener('click', function () {
    const questionInputs = document.getElementById('questionInputs');
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.name = 'productQuestion[]';
    newInput.required = true;
    questionInputs.appendChild(newInput);
  });


  addOptionButton.addEventListener('click', function () {
    const optionInputs = document.getElementById('optionInputs');
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.name = 'productOption[]';
    newInput.required = true;
    optionInputs.appendChild(newInput);
  });


  addProductButton.addEventListener('click', function () {
    // Retrieve values from the input fields
    const productName = document.getElementById('productName').value;
    const productQuestions = Array.from(document.getElementsByName('productQuestion[]')).map(input => input.value);
    const productOptions = Array.from(document.getElementsByName('productOption[]')).map(input => input.value);

    // trim the values
    productName.trim();
    productQuestions.forEach(question => question.trim());
    productOptions.forEach(option => option.trim());

    // Create an array of Question instances
    const questions = productQuestions.map((question, index) => {
      const options = productOptions.slice(index * 3, (index * 3) + 3).map((option, index) => new Option(index + 1, option));
      return new Question(index + 1, question, options);
    });

    // Get the next available ID for the new product
    db.getNumberOfElements((count) => {
      const productId = count + 1;

      // Create a new product instance
      const product = new Product(productId, productName, questions);
      db.insertProduct(product, (newDocument) => {
        showMessage(`Product ${newDocument.name} was added successfully!`, 'green');
        product.displayInfo();
      });
    });
  });



  resetDatabaseButton.addEventListener('click', function () {
    db.resetDatabase();
    showMessage('Database was reset successfully!', 'green');
  });

  getProductButton.addEventListener('click', function () {
    const productName = document.getElementById('productNameToGet').value;

    db.findProductByName(productName, (document) => {
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
  const messageElement = document.getElementById('message');
  messageElement.textContent = message;
  messageElement.style.color = color;
}
