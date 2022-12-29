const chooseRandom = (words) => {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};

const hasSuccessors = (successorTree) => {
  if (!successorTree) {
    return false;
  }
  return Object.keys(successorTree).length > 0;
}

/**
 * Returns a successor to the given tokens. If an empty tree is provided, returns null.
 *
 * @param {Object} successorTree The successor tree from which to generate the next word.
 * @param {Array} tokens An array of tokens used to find the successor.
 * @returns {String} The next word.
 */
const findSuccessor = (successorTree, tokens) => {
  if (!hasSuccessors(successorTree)) {
    return null;
  }
  
  let currentNode = successorTree;
  for (let token of tokens) {
    // Check for a branch with successors in our current node
    if (hasSuccessors(currentNode[token])) {
      currentNode = currentNode[token];
    }
    // Check for a branch with successors in the root
    else if (hasSuccessors(successorTree[token])) {
      currentNode = successorTree[token];
    }
    // Otherwise, use root node
    else {
      currentNode = successorTree;
    }
  }

  return chooseRandom(Object.keys(currentNode));
};

module.exports = findSuccessor;
