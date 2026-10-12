
// ----- [toPascalCase]
const toPascalCase = (value) => value
	.split(/[_ ]/)
	.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
	.join('');



const toPascalCaseFunc = (value) => value
	.split(/[_ ]/)
	.map((word, index) => {
		if (index === 0) {
			return word.toLowerCase();
		}
		return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
	})
	.join('');

// ----- [toSnake]
const toSnake = (value) => value
	.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
	.toLowerCase()
	.replace(/^_/, '');

// ----- [toPascalCase]
const toPascalCaseForAssets = (value) => {
	return value
		.replace(/[_ ]/g, '') // Remove underscores and spaces
		.split(/(?=[A-Z])/) // Split by uppercase letters
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join('');
};


module.exports = {
	toSnake, toPascalCase, toPascalCaseForAssets, toPascalCaseFunc
};
