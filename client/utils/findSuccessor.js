const getAccumulatedWeights = (weights) => {
  const result = [...weights];
  for (let i = 1; i < result.length; i += 1) {
    result[i] += result[i - 1];
  }
  return result;
};

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
export const findSuccessor = (word, table, exclude = [], weighted = true) => {
  if (!(word in table)) {
    return null;
  }

  const weights = getAccumulatedWeights(table[word].weights);

  // FIXME:
  const successors = table[word].successors.map((s, index) => {
    if (exclude.includes(s)) {
      weights.splice(index);
    } else {
      return s;
    }
  });

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
};

export const getFirstWord = (table) => {
  const words = Object.keys(table);
  const randy = Math.floor(Math.random() * words.length);
  const word = words[randy];
  const capitalized = word[0].toUpperCase() + word.substring(1);
  return capitalized;
};

export default findSuccessor;