import React from 'react';
import PropTypes from 'prop-types';

const getWordStyle = () => {
  return { 
    display: 'inline-block', 
    whiteSpace: 'pre', 
    cursor: 'pointer' 
  };
}



const SuggestionPreview = ({ onClick, suggestion }) => {

  const getSuggestionStyle = () => {
    return {...getWordStyle(), color: 'red'}
  }

  return (
    <div onClick={onClick} style={getSuggestionStyle()}>
      <em>{suggestion}</em>
    </div>
  )
}

const formatWord = (word) => { // TODO:
  return word.trim() + ' ';
}

const capitalize = (word) => {
  return word.substr(0, 1).toUpperCase() + word.substr(1);
}

const endsInTerminalPunctuation = (word) => {
  return /[!.?]+$/.test(word); 
}

const formatWordsArray = (words) => {
  const result = [...words];
  
  if (!result.length) {
    return [];
  }

  result[0] = capitalize(result[0]);

  for (let i = 1; i < result.length; i += 1) {
    if (endsInTerminalPunctuation(result[i - 1])) {
      result[i] = capitalize(result[i]);
    }
  }

  return result;
}

const Sentence = ({ words, onWordClick }) => {

  const formattedWords = formatWordsArray(words);

  return (
    <div style={getWordStyle()}>
      {
        formattedWords.map((word, index) => {
          return (
            <div key={index} style={getWordStyle()} onClick={() => onWordClick(index)}>
              {formatWord(word)}
            </div>
          )
        })
      }
    </div>
  )
}

const SentenceDisplay = ({ sentenceArray, writingInput, suggestion, showPreview, onWordClick, onSuggestionClick }) => {

  const getWritingInputStyle = () => {
    return {...getWordStyle(), color: 'blue'}
  }

  return (
    <div>
      <Sentence words={sentenceArray} onWordClick={onWordClick} />
      <div style={getWritingInputStyle()}>{writingInput}</div>
      {showPreview && <SuggestionPreview onClick={onSuggestionClick} suggestion={suggestion}/>}
    </div>
  )
}

SentenceDisplay.propTypes = {
  sentenceArray: PropTypes.array,
  writingInput: PropTypes.string,
  suggestion: PropTypes.string,
  showPreview: PropTypes.bool,
  onWordClick: PropTypes.func,
  onSuggestionClick: PropTypes.func
}

export default SentenceDisplay;