const chooseRandom = (words) => {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};

const isEmptyObject = (obj) => {
  return Object.keys(successorTree).length === 0;
}

/**
 * Returns a successor to the given tokens. If an empty tree is provided, returns null.
 *
 * @param {Object} successorTree The successor tree from which to generate the next word.
 * @param {Array} tokens An array of tokens used to find the successor.
 * @returns {String} The next word.
 */
const findSuccessor = (successorTree, tokens) => {
  if (isEmptyObject(successorTree)) {
    return null;
  }

  let currentNode = successorTree;
  for (let token of tokens) {
    // If successor branch exists and is not a leaf, move to it
    const successorNode = currentNode[token];
    if (successorNode && !isEmptyObject(successorNode)) {
      currentNode = successorNode;
    }
    // Otherwise, move back to the root
    else {
      currentNode = successorTree;
    }
  }

  return chooseRandom(Object.keys(currentNode));
};

module.exports = findSuccessor;
