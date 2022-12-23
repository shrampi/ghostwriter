/**
 * Returns an array of words that have had whitespace/special chars removed and lowercased. 
 *
 * @param {String} input The text to be tokenized.
 * @returns {Array} an array of string tokens. 
 */
 const parseStringIntoTokens = (input) => {
  // How not to make a regex:
  // const relicOfSin = /\d:\d|[A-Z]{2,}\.*|\d+\.|[:;@#$%^&*()\[\]{}=+\\\/`~<>"\d_\u007B-\uFFFF]+/gu;
  
  if (!input || !input.trim()) {
    return [];
  }
  const result = input
    .replace(/[-\.?!]+/g, ' ')
    .replace(/[^A-Za-z\s]+/g, '')
    .replace(/[\s]+/g, ' ')
    .toLowerCase()
    .trim()
    .split(' ');
  return result;
};

module.exports = parseStringIntoTokens;