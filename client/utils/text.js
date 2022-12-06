const capitalize = (word) => {
  return word.substr(0, 1).toUpperCase() + word.substr(1);
}

const endsInTerminalPunctuation = (word) => {
  return /[!.?]+$/.test(word); 
}

const removeExtraWhitespace = (input) => {
  return input.replace(/[\s]+/g, ' ').trim();
}

export default { capitalize, endsInTerminalPunctuation, removeExtraWhitespace };