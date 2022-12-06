import React from 'react';
import PropTypes from 'prop-types';

// Formatted sentence (capitalize and space correctly), writing input (as is), suggestion (capitalize and space correctly)

const SentenceDisplay = ({ sentenceArray, writingInput, suggestion, showPreview, onWordClick }) => {

  const getSentenceStyle = () => {
    return { 
      display: 'inline-block', 
      whiteSpace: 'pre', 
      cursor: 'pointer' 
    };
  }
  
  const getWritingInputStyle = () => {
    return {...getSentenceStyle(), color: 'blue'}
  }

  const getSuggestionStyle = () => {
    return {...getSentenceStyle(), color: 'red'}
  }

  const capitalize = (word) => {
    return word.substr(0, 1).toUpperCase() + word.substr(1);
  }
  
  const endsInTerminalPunctuation = (word) => {
    return /[!.?]+$/.test(word); 
  }

  return (
    <div>
      {
        sentenceArray.map((word, index) => {
          return (
            <div key={index} style={getSentenceStyle()} onClick={() => onWordClick(index)}>
              {word + ' '}
            </div>
          )
        })
      }
      <div style={getWritingInputStyle()}>{writingInput + ' '}</div>
      <div style={getSuggestionStyle()}><em>{suggestion}</em></div> 
    </div>
  )
}

SentenceDisplay.propTypes = {
  sentenceArray: PropTypes.array,
  writingInput: PropTypes.string,
  suggestion: PropTypes.string,
  showPreview: PropTypes.bool,
  onWordClick: PropTypes.func,
}

export default SentenceDisplay;