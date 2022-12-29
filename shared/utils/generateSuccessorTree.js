const parseStringIntoTokens = require("./parseStringIntoTokens");

const generateTreeFromTokens = (tokens) => {
  const result = {};

  for (let i = 0; i < tokens.length; i += 1) {
    const tokensToAdd = tokens.slice(i, i+4);
  
    let currentNode = result;
    for (let token of tokensToAdd) {
      // If token isn't a branch in the current node, add it
      if (!currentNode[token]) {
        currentNode[token] = {};
      }
      currentNode = currentNode[token];
    }
  }

  return result;
};

const generateSuccessorTree = (text) => {
  const tokens = parseStringIntoTokens(text);
  const tree = generateTreeFromTokens(tokens);
  return tree;
}

module.exports = generateSuccessorTree;