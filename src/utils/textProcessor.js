/**
 * Removes header/footer content from Gutenberg book texts. Both header and footer start and end with '***'
 * NOTE: need to make sure this is standard across books.
 *
 * @param {String} text
 * @returns {String}
 */
const removeHeaderAndFooterFromGutenbergText = (text) => {
  let result = text.slice();
  const headerStartIndex = result.indexOf('***');
  if (headerStartIndex === -1) {
    return result;
  }
  const headerEndIndex = result.indexOf('***', headerStartIndex + 3);
  const footerStartIndex = result.indexOf('***', headerEndIndex + 3);
  result = result.slice(headerEndIndex + 3, footerStartIndex);
  return result;
};

/**
 * Returns an array of word tokens from the text.
 *
 * @param {String} text The text to be tokenized.
 * @param {RegExp} charsToTokenize Any non alphanumeric characters that should be treated as unique token.
 * @param {RegExp} charsToRemove Characters to be removed from the text.
 * @returns
 */
const parseTokensFromText = (text, charsToRemove, specialCharsToTokenize) => {
  const removedHeader = removeHeaderAndFooterFromGutenbergText(text);
  const removedInvalids = removedHeader.replace(charsToRemove, '');
  const spaced = removedInvalids.replace(specialCharsToTokenize, ' $1 ');
  const removedWhitespace = spaced.replace(/\s+/g, ' ');
  const trimEnd = removedWhitespace.trim().toLowerCase();

  return trimEnd.split(' ');
};

const addSuccessorToTable = (table, key, successor) => {
  const index = table[key].successors.indexOf(successor);
  if (index !== -1) {
    table[key].weights[index] += 1;
  } else {
    table[key].successors.push(successor);
    table[key].weights.push(1);
  }
};

const generateTableFromTokens = (tokens, tokensToExclude) => {
  let result = {};
  for (let i = 0; i < tokens.length - 1; i += 1) {
    let current = tokens[i];
    let successor = tokens[i + 1];

    // If the current word is not in our table, add it
    if (!result.hasOwnProperty(current)) {
      result[current] = {
        successors: [],
        weights: [],
      }
    }

    if (!tokensToExclude.test(successor)) {
      addSuccessorToTable(result, current, successor);
    }
  }

  return result;
};

const accumulateTableWeights = (table) => {
  Object.keys(table).map((key) => {
    const weights = table[key].weights;
    for (let i = 1; i < weights.length; i += 1) {
      weights[i] += weights[i - 1];
    }
  })
}

const generateSuccessorTable = (text, charsToRemove, specialCharsToTokenize) => {
  const tokens = parseTokensFromText(
    text,
    charsToRemove,
    specialCharsToTokenize
  );
  const table = generateTableFromTokens(tokens, specialCharsToTokenize);
  accumulateTableWeights(table);
  
  table.getSuccessor = (word) => {
    if (!(word in table)) {
      return null;
    }
    const successors = table[word].successors;
    if (successors.length === 0) {
      return null;
    }
    const weights = table[word].weights;
    const totalSuccessors = weights[weights.length - 1];
    const randy = Math.floor(Math.random() * totalSuccessors); 

    for (let i = 0; i < weights.length; i += 1) {
      if (weights[i] > randy) {
        return successors[i];
      }
    }
  }
  
  return table;
}

const shakespeare = require('../resources/shakespeare');
const middlemarch = require('../resources/middlemarch');
const wonderland = require('../resources/wonderland');

const charsToTokenize = /([.,:;!?]+)/g;
//const invalidCharacters = ['@', '#', '$', '%', '^', '&', '*', '(', ')', '[', ']', '{', '}', '=', '+', '\\', '/', '`', '~', '\"']
const charsToRemove = /[@#$%^&*()\[\]{}=+\\\/`~<>"\d_]+/g;

const exampleText =
  'a b@c #d$e% 456  f^g&\n\n \nh*i (j)k_l\n+m a &&&&=n\\o/p>q< r"s...tu 1v.\n\n2223w!x?yz.??!.??!... a nopq';

const shakespeareTable = generateSuccessorTable(shakespeare, charsToRemove, charsToTokenize);
const middlemarchTable = generateSuccessorTable(middlemarch, charsToRemove, charsToTokenize);
const wonderlandTable = generateSuccessorTable(wonderland, charsToRemove, charsToTokenize);

let sentence = '';
let prev = '.'
for (let i = 0; i < 100; i += 1) {
  let word = shakespeareTable.getSuccessor(prev);
  if (!word) {
    word = '.';
  }
  sentence += word + ' ';
  prev = word;
}

console.log('\n============');
console.log('From Shakespeare:')
console.log(sentence);
console.log('\n============');

sentence = '';
prev = '.'
for (let i = 0; i < 100; i += 1) {
  let word = middlemarchTable.getSuccessor(prev);
  if (!word) {
    word = '.';
  }
  sentence += word + ' ';
  prev = word;
}

console.log('From Middlemarch:')
console.log(sentence);
console.log('\n============');

sentence = '';
prev = ''
for (let i = 0; i < 100; i += 1) {
  let word = wonderlandTable.getSuccessor(prev);
  if (!word) {
    word = '.';
  }
  sentence += word + ' ';
  prev = word;
}

console.log('From Alice in Wonderland:')
console.log(sentence);
console.log('\n============');