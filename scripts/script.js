import { initDatabase, Product, insertProduct } from './database.js';

const db = initDatabase();

const productNameInput = document.getElementById('productName');

// Define addProduct function at the top
function addProduct() {
  const productName = productNameInput.value;

  if (productName) {
    insertProduct(db, new Product(0, productName, []), (newDocument) => {
      showMessage(`Added product ${newDocument.name}`, 'green');
    });
  } else {
    showMessage('Please enter a product name', 'red');
  }
}

// Add event listener
document.getElementById('addProductButton').addEventListener('click', addProduct);

function showMessage(message, color) {
  const messageElement = document.getElementById('message');
  messageElement.textContent = message;
  messageElement.style.color = color;
}
