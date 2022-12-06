import React from 'react';
import { useState, useEffect, useRef } from 'react';
import bookService from '../services/bookService';
import sourcesService from '../services/sourcesService';
import suggestionService from '../services/suggestionService';
import parseStringIntoTokens from '../utils/parseStringIntoTokens';
import textUtils from '../utils/text';

import Welcome from './Welcome';
import SourceSelector from './SourceSelector';
import WritingForm from './WritingForm';
import SentenceDisplay from './SentenceDisplay';
import OptionsMenu from './OptionsMenu';
import CheckboxInput from './CheckboxInput';
import text from '../utils/text';

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

  /*
  TODO:
  - is there a way to simplify the representation of the sentence / writing input / suggestion?
    - right now sentence is an array, writing input and suggestion are strings. This is making some things more challenging. 
    - what if we make sentence a string as well. Then it can be changed into an array in the SentenceDisplay component? We can split by \n characters to go to new lines as well. 
    - rename some things - rename sentence to document. Rename writing input to user input. 
  - implement a num query for getting new words. That way the response will contain 'num' words that you can tack on. Suggestion can then be more than one word.  

  */

  const initializeSourcesHook = () => {
    console.log('Initializing sources...');
    sourcesService
      .getSources()
      .then((sources) => {
        console.log('Sources found: ', sources.map((s) => s.title));
        setSources(sources);
        const defaultSource = sources.find((source) => {
          return (
            source.title === 'Complete Works' &&
            source.author === 'William Shakespeare'
          );
        });
        if (!defaultSource) {
          console.log(
            'Complete Works of Shakespeare not found as default source.'
          );
          return;
        }
        setCurrentSource(defaultSource);
      })
      .catch((error) => {
        console.log('Error retrieving sources: ', error.message);
      });
  };

  useEffect(initializeSourcesHook, []);

  const getSentenceTokens = () => {
    let tokens = [];
    for (let word of sentenceArray) {
      tokens = tokens.concat(parseStringIntoTokens(word));
    }
    console.log(tokens);
    return tokens;
  };

  const lastTokensOfSentenceAndInput = () => {
    const inputTokens = parseStringIntoTokens(writingInput);
    const sentenceTokens = getSentenceTokens();
    const allTokens = sentenceTokens.concat(inputTokens);
    if (allTokens.length > suggestionAccuracy) {
      return allTokens.slice(allTokens.length - suggestionAccuracy);
    }
    return allTokens;
  };

  const tokensPrecedingSentenceIndex = (index) => {
    const wordsToConsider = getSentenceTokens().slice(0, index);
    if (index > suggestionAccuracy) {
      return wordsToConsider.slice(index - suggestionAccuracy);
    }
    return wordsToConsider;
  };

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
      .then((suggestion) => {
        return suggestion;
      })
      .catch((error) => {
        console.log('Error retrieving suggestion: ', error.message);
        return '';
      });
  };

  const suggestionShouldBeCapitalized = () => {
    const formattedWriting = textUtils.removeExtraWhitespace(writingInput);

    if (textUtils.endsInTerminalPunctuation(formattedWriting)) {
      return true;
    }
    if ()
    return (
      (!formattedWriting && sentenceArray.length === 0)
      || (sentenceArray.length === 0 && textUtils.endsInTerminalPunctuation(formattedWriting))
      || (!formattedWriting && textUtils.endsInTerminalPunctuation(sentenceArray[sentenceArray.length - 1]))
    );
  }

  const updateSuggestionHook = () => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const predecessors = lastTokensOfSentenceAndInput();
    retrieveSuggestion(predecessors).then((suggestion) => {
      if (suggestionShouldBeCapitalized()){
        return setSuggestion(textUtils.capitalize(suggestion));
      }
      setSuggestion(suggestion);
    });
  };

  useEffect(updateSuggestionHook, [writingInput, sentenceArray, currentSource]);

  const handleSourceSelection = (event) => {
    const selectedID = event.target.value;
    setCurrentSource(sources.find((source) => source.id === selectedID));
  };

  const handleWritingChange = (event) => {
    const input = event.target.value;
    setWritingInput(input);
  };

  const handleWritingSubmit = (event) => {
    event.preventDefault();
    let newSentence = [...sentenceArray];
    const formattedWriting = textUtils.removeExtraWhitespace(writingInput);
    if (formattedWriting) {
      newSentence = newSentence.concat(formattedWriting.split(' '));
    }
    if (suggestion) {
      newSentence.push(suggestion);
    }
    setSentenceArray(newSentence);
    setWritingInput('');
  };

  const handleWordClick = (wordIndex) => {
    const predecessors = tokensPrecedingSentenceIndex(wordIndex);
    retrieveSuggestion(predecessors).then((suggestion) => {
      let newSentence = [...sentenceArray];
      newSentence[wordIndex] = suggestion;
      setSentenceArray(newSentence);
    });
  };

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
