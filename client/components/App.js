import React from 'react';
import { useState, useEffect, useRef } from 'react';
import bookService from '../services/bookService';
import sourcesService from '../services/sourcesService';
import suggestionService from '../services/suggestionService';
import parseInputIntoTokens from '../utils/parseInputIntoTokens';
import formatWordIntoToken from '../utils/formatWordIntoToken';

import Welcome from './Welcome';
import SourceSelector from './SourceSelector';
import WritingForm from './WritingForm';
import SentenceDisplay from './SentenceDisplay';
import OptionsMenu from './OptionsMenu';
import CheckboxInput from './CheckboxInput';

const App = () => {
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [notification, setNotification] = useState('');
  const [sources, setSources] = useState([]);
  const [currentSource, setCurrentSource] = useState({});
  const [sentenceArray, setSentenceArray] = useState([]);
  const [writingInput, setWritingInput] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const firstRender = useRef(true);
  const [suggestionAccuracy, setSuggestionAccuracy] = useState(3); // Articulate, intelligible, experimental, inebriated
  const [showPreview, setShowPreview] = useState(true);


  const initializeSourcesHook = () => {
    console.log('Initializing sources...');
    sourcesService
      .getSources()
      .then((sources) => {
        console.log('Sources found: ', sources.map(s => s.title));
        setSources(sources);
        const defaultSource = sources.find((source) => {
          return (
            source.title === 'Complete Works'
            && source.author === 'William Shakespeare'
          );
        })
        if (!defaultSource) {
          console.log('Complete Works of Shakespeare not found as default source.');
          return;
        }
        setCurrentSource(defaultSource);
      })
      .catch((error) => {
        console.log('Error retrieving sources: ', error.message);
      });
  };

  useEffect(initializeSourcesHook, []);
  
  const lastTokensOfSentenceAndInput = () => {
    const inputTokens = parseInputIntoTokens(writingInput);
    const allTokens = sentenceArray.map(word => formatWordIntoToken(word)).concat(inputTokens);
    if (allTokens.length > suggestionAccuracy) {
      return allTokens.slice(allTokens.length - suggestionAccuracy);
    }
    return allTokens;
  };

  const tokensPrecedingSentenceIndex = (index) => {
    const wordsToConsider = sentenceArray
      .slice(0, index)
      .map(word => formatWordIntoToken(word));
    if (index > suggestionAccuracy) {
      return wordsToConsider.slice(index - suggestionAccuracy);
    }
    return wordsToConsider;
  }

  /**
   * Helper function that uses suggestionService to retrieve a suggested word from the currentSource. 
   * If an error occurs, it will log it and resolve to an empty string.
   * 
   * @param {Array} predecessors 
   * @returns {Promise}
   */
  const retrieveSuggestion = (predecessors) => {
    if (!predecessors) predecessors = [];
    return suggestionService
      .getSuggestionFromSource(currentSource, predecessors)
      .then(suggestion => {
        return suggestion;
      })
      .catch(error => {
        console.log('Error retrieving suggestion: ', error.message);
        return '';
      })
  }

  const updateSuggestionHook = () => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const predecessors = lastTokensOfSentenceAndInput();
    console.log('Updating suggestion for predecessors: ', predecessors);
    retrieveSuggestion(predecessors).then(suggestion => {
      setSuggestion(suggestion);
    })
  };

  useEffect(updateSuggestionHook, [writingInput, currentSource]);

  const hideWelcomeText = () => {
    if (welcomeVisible) {
      setWelcomeVisible(false);
    }
  };

  const handleSourceSelection = (event) => {
    hideWelcomeText();
    const selectedID = event.target.value;
    setCurrentSource(sources.find((source) => source.id === selectedID));
  };

  const handleWritingChange = (event) => {
    hideWelcomeText();
    const input = event.target.value;
    setWritingInput(input);
  };

  const handleWritingSubmit = (event) => {
    event.preventDefault();
    hideWelcomeText();
    const words = writingInput.trim().split(' ');
    const newSentence = sentenceArray.concat(words);
    if (suggestion) {
      newSentence.push(suggestion);
    }
    setSentenceArray(newSentence); 
    setWritingInput('');
  };

  const handleWordClick = (wordIndex) => {
    const predecessors = tokensPrecedingSentenceIndex(wordIndex);
    retrieveSuggestion(predecessors).then(suggestion => {
      let newSentence = [...sentenceArray];
      newSentence[wordIndex] = suggestion;
      setSentenceArray(newSentence);
    })
  };

  const handleSuggestionClick = () => {
    const predecessors = lastTokensOfSentenceAndInput();
    console.log('Updating suggestion for predecessors: ', predecessors);
    retrieveSuggestion(predecessors).then(suggestion => {
      setSuggestion(suggestion);
    })
  }

  return (
    <div>
      {/* TODO: <Header /> */}
      <h1>GhostWriter</h1>
      {notification}
      {welcomeVisible && <Welcome />}
      {/* <Hint text='' /> */}
      <SentenceDisplay
        sentenceArray={sentenceArray}
        writingInput={writingInput}
        suggestion={suggestion}
        showPreview={showPreview}
        onWordClick={handleWordClick}
        onSuccessorClick={handleSuggestionClick}
      />
      <WritingForm
        style={{ float: 'none' }}
        onSubmit={handleWritingSubmit}
        onChange={handleWritingChange}
        value={writingInput}
      />
      <SourceSelector // TODO: this needs to default to initial currentSource (shakespeare)
        sources={sources}
        value={currentSource.id}
        onChange={handleSourceSelection}
      />
      <OptionsMenu>
        <CheckboxInput
          label={"Show preview of ghostwriter's suggestion:"}
          value={showPreview}
          onChange={() => setShowPreview(!showPreview)}
        />
      </OptionsMenu>

      {/* TODO: <Footer/> */}
    </div>
  );
};

export default App;
