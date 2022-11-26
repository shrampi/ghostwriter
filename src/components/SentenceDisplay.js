import React from 'react';
import PropTypes from 'prop-types';
import { parseTokensFromText } from '../utils/successorTable';

const SentenceDisplay = ({ sentenceArray, writingInput, successor, showPreview, onWordClick, onSuccessorClick }) => {

  const getWordStyle = () => {
    return { display: 'inline-block', whiteSpace: 'pre', cursor:'pointer' };
  }

  const getWritingInputStyle = () => {
    return {...getWordStyle(), color: 'blue'}
  }

  const getSuccessorStyle = () => {
    return {...getWordStyle(), color: 'red'}
  }

  const formatWord = (word) => {
    if (/[^\w-']+/.test(word)) {
      return word;
    }
    return (` ${word}`);
  }

  // TODO: refactor into smaller components
  return (
    <div>
      {
        sentenceArray.map((word, index) => {
          return (
            <div
              key={index}
              onClick={() => onWordClick(index)}
              style={getWordStyle(word)}
            >
              {formatWord(word)}
            </div>
          )
        })
      }
      {
        parseTokensFromText(writingInput).map((word, index) => {
          return (
            <div
              key={index}
              style={getWritingInputStyle(word)}
            >
              {formatWord(word)}
            </div>
          )
        })
      }
      {
        showPreview && <div onClick={onSuccessorClick} style={getSuccessorStyle()}><em>{successor ? formatWord(successor) : ""}</em></div>
      }
    </div>
  )
}

SentenceDisplay.propTypes = {
  sentenceArray: PropTypes.array,
  writingInput: PropTypes.string,
  successor: PropTypes.string,
  showPreview: PropTypes.bool,
  onWordClick: PropTypes.func,
  onSuccessorClick: PropTypes.func
}

export default SentenceDisplay;