/**
 * Returns an array of lowercase tokens from the text.
 *
 * @param {String} text The text to be tokenized.
 * @param {RegExp} charsToTokenize Any characters that should be treated as unique tokens.
 * @param {RegExp} charsToRemove Characters to be removed from the text.
 * @returns
 */
 const parseTokensFromText = (
  text,
  charsToRemove = /[\W_]+|[A-Z]{2,}\.*/g,
) => {
  // How not to make a regex:
  let relicOfSin = /\d:\d|[A-Z]{2,}\.*|\d+\.|[:;@#$%^&*()\[\]{}=+\\\/`~<>"\d_\u007B-\uFFFF]+/gu;
  if (!result) {
    return [];
  }
  let result = text.replace(charsToRemove, '');  
  result = result.replace(/([.,!?]+)/g, ' $1 ');
  result = result.replace(/[\s]+/g, ' ');
  result = result.trim();

  if (!result) {
    return [];
  }
  return result.split(' ');
};

export default parseTokensFromText;