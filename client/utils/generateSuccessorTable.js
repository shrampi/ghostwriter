import parseTokensFromText from "./parseTokensFromText";

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

