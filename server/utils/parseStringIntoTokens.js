/**
 * Returns an array of words that have had whitespace/special chars removed and lowercased. 
 *
 * @param {String} input The text to be tokenized.
 * @returns {Array} an array of string tokens. 
 */
 const parseStringIntoTokens = (input) => {
  // How not to make a regex:
  // const relicOfSin = /\d:\d|[A-Z]{2,}\.*|\d+\.|[:;@#$%^&*()\[\]{}=+\\\/`~<>"\d_\u007B-\uFFFF]+/gu;
  
  if (!input) {
    return [];
  }
  const result = input
    .replace(/[^A-Za-z\s-]+/g, '') // Remove any character that isn't a letter, a hyphen, or whitespace
    .replace(/[\s]+/g, ' ') // Replace white spaces with single space
    .toLowerCase()
    .trim()
    .split(' ');
  return result;
};

module.exports = parseStringIntoTokens;