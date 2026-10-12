function transformToCamelCase(input, typesToRemove) {
  let fileName = input;

  // Remove specified file extensions
  if (typesToRemove && typesToRemove.length > 0) {
    const extPattern = typesToRemove.map(ext => `\\${ext}`).join('|');
    const regex = new RegExp(`(${extPattern})$`, 'i');
    fileName = fileName.replace(regex, '');
  }

  // Use a regular expression to match words separated by spaces, underscores, or hyphens
  const words = fileName.split(/[_\s-]+/);

  // Transform the first word to lowercase and capitalize the first letter of subsequent words
  const transformedWords = words.map((word, index) => {
    if (index === 0) {
      // Keep the first word with the first letter in lowercase
      return word.charAt(0).toLowerCase() + word.slice(1);
    } else {
      // Capitalize the first letter of subsequent words
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
  });

  // Join the words to form the Camel Case string
  return transformedWords.join('');
}

module.exports = {
  transformToCamelCase
}
