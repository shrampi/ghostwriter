const chooseRandom = (words) => {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};

/**
 * Returns a successor randomly chosen from the predecessor words chain in the given
 * source data.
 *
 * @param {Object} source The successor table from which to generate the next word.
 * @param {Array} predecessor An array of tokens used to find the successor.
 * @returns {String} The next word.
 */
const findSuccessor = (successorTable, tokens) => {
  let potentialSuccessors = successorTable;
  for (let i = 0; i < tokens.length; i += 1) {
    if (word in potentialSuccessors) {
      potentialSuccessors = potentialSuccessors[word];
    }
  }

  if (!(potentialSuccessors instanceof Array)) {
    potentialSuccessors = Object.keys(potentialSuccessors);
  }

  return chooseRandom(potentialSuccessors);
};

module.exports = findSuccessor;
