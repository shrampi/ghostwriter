const formatWordIntoToken = (word) => {
  const result = word
    .replace(/[^A-Za-z\s-]+/g, '') // Remove any character that isn't a letter, a hyphen, or whitespace
    .replace(/[\s]+/g, ' ') // Replace white spaces with single space
    .toLowerCase()
    .trim()
    .split(' ');
  return result;
}

export default formatWordIntoToken;