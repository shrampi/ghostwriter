import React from 'react';

const SentenceDisplay = ({ sentence, onWordClick }) => {
  
  const getWordStyle = (word) => {
    return {display: 'inline-block', whiteSpace: 'pre'};
  }

  const formatWord = (word) => {
    if ([',', '.', '!', '?'].includes(word)) {
      return word;
    }
    return (` ${word}`);
  }
  
  return (
    <div>
      {sentence.map((word, index) => {
        return (
          <div 
            key={index} 
            onClick={() => onWordClick(index)} 
            style={getWordStyle(word)}
          >
            {formatWord(word)}
          </div>
        )
      })}
    </div>
  )
}

export default SentenceDisplay;