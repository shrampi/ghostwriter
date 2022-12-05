/**
 * Returns an array of lowercase tokens from the text.
 *
 * @param {String} text The text to be tokenized.
 * @param {RegExp} charsToTokenize Any characters that should be treated as unique tokens.
 * @param {RegExp} charsToRemove Characters to be removed from the text.
 * @returns
 */
 const parseInputIntoTokens = (text) => {
  // How not to make a regex:
  // const relicOfSin = /\d:\d|[A-Z]{2,}\.*|\d+\.|[:;@#$%^&*()\[\]{}=+\\\/`~<>"\d_\u007B-\uFFFF]+/gu;
  
  if (!text) {
    return [];
  }
  const result = text
    .replace(/[^A-Za-z\s-]+/g, '') // Remove any character that isn't a letter, a hyphen, or whitespace
    .replace(/[\s]+/g, ' ') // Replace white spaces with single space
    .toLowerCase()
    .trim()
    .split(' ');
  return result;
};

export default parseInputIntoTokens;