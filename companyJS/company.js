export class Company {
    constructor(id, name, address, mailAdress, faxNum, taxNum, products = []) {
        this.id = id;
        this.name = name;
		this.address = address;
		this.mailAdress = mailAdress;
		this.faxNum = faxNum;
		this.taxNum = taxNum;
		this.products = products;
    }

    displayInfo() {
		console.log(`Product ID: ${this.id}`);
		console.log(`Product Name: ${this.name}`);
		console.log(`Product Address: ${this.address}`);
		console.log(`Product Mail Adress: ${this.mailAdress}`);
		console.log(`Product Fax Number: ${this.faxNum}`);
		console.log(`Product Tax Number: ${this.taxNum}`);

		// Display the products
		console.log('Products:');
		this.products.forEach(product => {
			console.log(`  Product ID: ${product.id}`);
			console.log(`  Product Name: ${product.name}`);
			console.log('  Questions:');
			product.questions.forEach(question => {
				console.log(`    Question ID: ${question.id}`);
				console.log(`    Question Text: ${question.text}`);
				console.log('    Options:');
			
				question.options.forEach(option => {
					console.log(`      Option ID: ${option.id}, Option Text: ${option.text}`);
				});	
			});
		});
    }
}