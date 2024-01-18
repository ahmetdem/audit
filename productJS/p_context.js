import { p_db } from "./p_database.js";
import { productsState } from "./p_editSearch.js";

document.addEventListener('DOMContentLoaded', function () {
	const searchResults = document.getElementById('search-results');
	const contextMenu = document.getElementById('context-menu');
	let selectedElement;

	searchResults.addEventListener('contextmenu', function (event) {
		event.preventDefault();
		selectedElement = event.target;
		const x = event.clientX;
		const y = event.clientY;
		showContextMenu(x, y);
	});

	function showContextMenu(x, y) {
		contextMenu.style.display = 'block';
		contextMenu.style.left = x + 'px';
		contextMenu.style.top = y + 'px';

		document.addEventListener('click', hideContextMenu);
	}

	function hideContextMenu() {
		contextMenu.style.display = 'none';
		document.removeEventListener('click', hideContextMenu);
	}

	// Add functionality for each context menu option
	const delete_option = document.getElementById('delete-option');

	delete_option.addEventListener('click', function () {

		confirm('Are you sure you want to delete this product?');

		p_db.findProductByName(selectedElement.textContent, (document) => {
			if (document) {
				p_db.deleteProduct(document, (numRemoved) => {
					if (numRemoved > 0) {
						console.log('Product was deleted successfully!');
					}
				});
			}
		});

		productsState.productsLoaded = false;

		hideContextMenu();
	});
});
