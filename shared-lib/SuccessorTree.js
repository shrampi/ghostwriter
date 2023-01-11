/** A data structure for providing suggestions given a sequence of values. */
class SuccessorTree {
  /**
   * 
   * @param {Array} tokens The sequence of values to be processed. 
   * @param {number} maxDepth The maximum height of the tree.
   */
  constructor(tokens, maxDepth=4) {
    this.data = this.#generateTreeFromTokens(tokens);
    this.maxDepth = maxDepth;
  }

  /**
   * Generates the underlying tree-like object from the token sequence.
   * @param {*} tokens 
   * @returns {object}
   */
  #generateTreeFromTokens(tokens) {
    const result = {};

    if (!tokens) {
      return result;
    }
  
    for (let i = 0; i < tokens.length; i += 1) {
      const tokensToAdd = tokens.slice(i, i + this.maxDepth);
    
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

  /**
   * Checks if the given tree node has any successor branches.
   * @param {*} node 
   * @returns {boolean}
   */
  #hasSuccessors(node) {
    if (!node) {
      return false;
    }
    return Object.keys(node).length > 0;
  }

  /**
   * Suggests a new item that would follow the sequence of tokens. 
   * @param {Array} tokens 
   * @returns 
   */
  getSuggestion(tokens) {
    if (!this.#hasSuccessors(this.data)) {
      return null;
    }
    
    let currentNode = this.data;
    for (let token of tokens) {
      // Check for a branch with successors in our current node
      if (this.#hasSuccessors(currentNode[token])) {
        currentNode = currentNode[token];
      }
      // Check for a branch with successors in the root
      else if (this.#hasSuccessors(this.data[token])) {
        currentNode = this.data[token];
      }
      // Otherwise, use root node
      else {
        currentNode = this.data;
      }
    }

    const possibleSuggestions = Object.keys(currentNode);
    const randomIndex = Math.floor(Math.random() * possibleSuggestions.length);
    return possibleSuggestions[randomIndex];
  }

  toString() {
    return JSON.stringify(this.data);
  }

  readString(JSONString) {
    this.data = JSON.parse(JSONString);
  }
}

module.exports = SuccessorTree;