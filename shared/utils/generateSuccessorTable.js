const parseStringIntoTokens = require("./parseStringIntoTokens");

const generateTableFromTokens = (tokens) => {
  if (tokens.length < 3) {
    return {};
  }
  const result = {};
  for (let i = 0; i < tokens.length - 3; i += 1) {
    const first = tokens[i];
    const second = tokens[i + 1];
    const third = tokens[i + 2];
    const fourth = tokens[i + 3];

    // If first token isn't in our table, add it
    if (!result[first]) {
      result[first] = {};
    }

    // If the second token isn't in our first tokens successors, add it.
    if (!result[first][second]) {
      result[first][second] = {};
    }

    // If the third token isn't in this chain, add it.
    if (!result[first][second][third]) {
      result[first][second][third] = [];
    }

    // If fourth token isn't part of chain, push it to final array.
    if (!result[first][second][third].includes(fourth)) {
      result[first][second][third].push(fourth);
    }
  }

  return result;
};

const generateSuccessorTable = (text) => {
  const tokens = parseStringIntoTokens(text);
  const output = generateTableFromTokens(tokens);
  return output;
}

module.exports = generateSuccessorTable;