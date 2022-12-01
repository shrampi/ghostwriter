/**
 * Removes header/footer content from Gutenberg book texts. Both header and footer start and end with '***'
 * TODO: need to make sure this is standard across books.
 *
 * @param {String} text
 * @returns {String} 
 */
const removeGutenbergHeaderAndFooter = (text) => {
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
 * Returns an array of lowercase tokens from the text.
 *
 * @param {String} text The text to be tokenized.
 * @param {RegExp} charsToTokenize Any characters that should be treated as unique tokens.
 * @param {RegExp} charsToRemove Characters to be removed from the text.
 * @returns
 */
const parseTokensFromText = (
  text,
  charsToRemove = /[^A-Za-z\s.,!?']+|[A-Z]{2,}\.*/g,
) => {

  let relicOfSin = /\d:\d|[A-Z]{2,}\.*|\d+\.|[:;@#$%^&*()\[\]{}=+\\\/`~<>"\d_\u007B-\uFFFF]+/gu;

  if (!text) {
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

/**
 * Adds a successor word to 'key' within the specified table, and increments the successor's weight. 
 * 
 * @param {Object} table The successor table to change.
 * @param {String} key The word that the successor will be added to.
 * @param {String} successor The successor to be added.
 */
const addSuccessorToTable = (table, key, successor) => {
  const index = table[key].successors.indexOf(successor);
  if (index !== -1) {
    table[key].weights[index] += 1;
  } else {
    table[key].successors.push(successor);
    table[key].weights.push(1);
  }
};

/**
 * Creates a successor table from the given array of tokens. Excluded chars will be added as table keys, but not as successors to those keys. 
 * In otherwords, an excluded char will never be suggested by the table's getSuccessor() method. 
 * 
 * @param {Array} tokens 
 * @param {RegExp} charsToExcludeAsSuccessors 
 * @returns 
 */
const generateTableFromTokens = (tokens, charsToExcludeAsSuccessors = /[.,!?]+/g) => {
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

    if (!charsToExcludeAsSuccessors.test(successor)) {
      addSuccessorToTable(result, current, successor);
    }
  }

  return result;
};

const getAccumulatedWeights = (weights) => {
  const result = [...weights];
  for (let i = 1; i < result.length; i += 1) {
    result[i] += result[i - 1];
  }
  return result;
}

/**
 * Returns a 'weighted successor table' from the given text. The table returned is given a getSuccessor() method to retrieve a successor.
 * 
 * @param {String} text 
 * @param {RegExp} charsToRemove 
 * @param {RegExp} charsToTokenize 
 * @returns 
 */
const generateSuccessorTable = (text) => {
  const headerlessText = removeGutenbergHeaderAndFooter(text);
  const tokens = parseTokensFromText(headerlessText);
  const table = generateTableFromTokens(tokens);

  return table;
}

/**
 * Retrieves a successor of word from the given successor table, or null if no successor is found. 
 * Any words in the exclude array will not be retrieved.
 * The successor is randomly selected from a weighted distribution, or is completely random if weighted=false. 
 * 
 * @param {String} word 
 * @param {Object} table 
 * @param {Array} exclude 
 * @param {Boolean} weighted 
 * @returns The chosen successor as a String. 
 */
const getSuccessorOf = (word, table, exclude = [], weighted = true) => {
  if (!(word in table)) {
    return null;
  }

  const weights = getAccumulatedWeights(table[word].weights);

  // FIXME:
  const successors = table[word].successors.map((s, index) => {
    if (exclude.includes(s)) {
      weights.splice(index);
    }
    else {
      return s;
    }

  })

  if (successors.length === 0) {
    return null;
  }

  if (!weighted) {
    const r = Math.floor(Math.random() * successors.length);
    return successors[r];
  }

  const totalSuccessors = weights[weights.length - 1];
  const randy = Math.floor(Math.random() * totalSuccessors);

  for (let i = 0; i < weights.length; i += 1) {
    if (weights[i] > randy) {
      return successors[i];
    }
  }
}

// const addTextToInitialSources = (name, pathToText) => {
//   const fs = require('fs');

//   const text = fs.readFileSync(pathToText, {encoding:'utf8', flag:'r'});
//   const sources = require('../../initialSources.json');
//   const table = generateSuccessorTable(text);

//   const newSource = {
//     name,
//     table
//   }
//   console.log('Finished creating new source from text file: ', newSource.name);

//   let sourceExists = false;
//   const newSources = sources.map(source => {
//     if (source.name === newSource.name) {
//       console.log('Updating existing source: ', source.name);
//       sourceExists = true;
//       return newSource;
//     }
//     return source;
//   });

//   if (!sourceExists) {
//     console.log('Adding source to initialSources: ', newSource.name);
//     newSources.push(newSource);
//   }

//   const newSourcesJSON = JSON.stringify(newSources);
//   console.log('Writing to file...');
//   fs.writeFileSync('initialSources.json', newSourcesJSON);
//   console.log('Finished')
// }

// addTextToInitialSources("Paradise Lost", 'text.txt');

export { parseTokensFromText, getSuccessorOf, generateSuccessorTable };

