class SuccessorTree {
  #tree;
  constructor(tokens) {
    this.#tree = this.generateTreeFromTokens(tokens);
  }

  generateTreeFromTokens(tokens) {
    const result = {};
  
    for (let i = 0; i < tokens.length; i += 1) {
      const tokensToAdd = tokens.slice(i, i + 4);
    
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

  hasSuccessors() {
    if (!this.#tree) {
      return false;
    }
    return Object.keys(#tree).length > 0;
  }

  findSuccessor(tokens) {
    if (!this.hasSuccessors(successorTree)) {
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
  }
}