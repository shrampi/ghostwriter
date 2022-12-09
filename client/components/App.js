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
import CompositionDisplay from './CompositionDisplay';
import OptionsMenu from './OptionsMenu';
import CheckboxInput from './CheckboxInput';
import NumberInput from './NumberInput';
import Button from './Button';
import GutenbergSearch from './GutenbergSearch';

/*
Initial sources:
shakespeare
bible
quran
paradise lost
all sherlock holmes
pride and prejudice
jane eyre
moby dick
idk at least like 20-30 options? 
*/


const App = () => {
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [notification, setNotification] = useState('');

  const [sources, setSources] = useState({
    current: {},
    server: [],
    client: []
  });

  const [composition, setComposition] = useState('');
  const [userInput, setUserInput] = useState('');

  const [suggestion, setSuggestion] = useState('');
  const [suggestionRequestTimeout, setSuggestionRequestTimeout] = useState(null);
  
  const [showSuggestionPreview, setShowSuggestionPreview] = useState(true);
  const [suggestionOptions, setSuggestionOptions] = useState({
    suggestionAccuracy: 3, // Articulate, intelligible, experimental, inebriated
    numSuggestedWords: 2
  });

  const initializeSourcesHook = () => {
    console.log('Initializing sources...');
    sourcesService.getSources().then((serverSources) => {
        console.log('Sources found: ', serverSources.map((s) => s.title));

        let defaultSource = serverSources.find((source) => {
          return (source.title === 'Complete Works' && source.author === 'William Shakespeare');
        });

        if (!defaultSource) {
          console.log('Complete Works of Shakespeare not found as default source.');
          defaultSource = serverSources[0];
          return;
        }

        const updatedSources = {...sources, server: serverSources, current: defaultSource};
        setSources(updatedSources);

        suggestionService.retrieveSuggestion([], defaultSource, suggestionOptions.suggestionAccuracy, suggestionOptions.numSuggestedWords)
          .then(suggestion => setSuggestion(suggestion));
      })
      .catch((error) => {
        console.log('Error retrieving initial sources: ', error.message);
      });
  };

  useEffect(initializeSourcesHook, []);

  const getTokensForSuggestion = () => {
    return parseStringIntoTokens(composition + ' ' + userInput);
  }

  const updateSuggestion = () => {
    const tokens = getTokensForSuggestion()
    suggestionService.retrieveSuggestion(tokens, sources.current, options.suggestionAccuracy, options.numSuggestedWords)
      .then(suggestion => {
        setSuggestion(suggestion);
      });
  }

  const queueSuggestionUpdate = (tokens, source, accuracy, amount) => {
    // Indicate suggestion is loading
    setSuggestion('...');
    const SUGGESTION_REQUEST_INTERVAL = 500;
    // If there's no suggestion request timer active: 
    if (!suggestionRequestTimeout) {
      // Make request and set suggestion
      suggestionService.retrieveSuggestion(tokens, source, accuracy, amount).then(suggestion => {
        setSuggestion(suggestion);
      });
      // start a timeout which will be the suggestionRequestTimeout. After 1 sec, will be set to null. 
      const timeoutID = setTimeout(() => {
        setSuggestionRequestTimeout(null);
      }, SUGGESTION_REQUEST_INTERVAL);
      setSuggestionRequestTimeout(timeoutID);
    }
    // If there is already a suggestion request timer active:
    else {
      // Clear the current timeout
      clearTimeout(suggestionRequestTimeout);
      // Create a new timeout that will update the suggestion after one second. 
      const timeoutID = setTimeout(() => {
        suggestionService.retrieveSuggestion(tokens, source, accuracy, amount).then(suggestion => {
          setSuggestion(suggestion);
        });
        setSuggestionRequestTimeout(null);
      }, SUGGESTION_REQUEST_INTERVAL);
      setSuggestionRequestTimeout(timeoutID);
    }
  }

  useEffect(queueSuggestionUpdateHook, [composition, userInput, suggestionOptions]);

  const getAllCurrentTokens = () => {
    return parseStringIntoTokens(composition + ' ' + userInput);
  }

  const handleSourceSelection = (event) => {
    const selectedID = event.target.value;
    const newSource = sources.find((source) => source.id === selectedID)
    const updatedSources = {...sources, current: newSource}
    setSources(updatedSources);
    const tokens = getAllCurrentTokens();
    queueSuggestionUpdate(tokens, newSource, suggestionOptions.suggestionAccuracy, suggestionOptions.numSuggestions);
  };

  const handleWritingChange = (event) => {
    const newUserInput = event.target.value;
    setUserInput(newUserInput);
    const tokens = parseStringIntoTokens(composition + ' ' + newUserInput);
    queueSuggestionUpdate(tokens, currentSource, suggestionAccuracy, numSuggestions);
  };

  const handleWritingSubmit = (event) => {
    event.preventDefault();
    if (!suggestionRequestTimeout) {
      const newComposition = composition + ' ' + userInput + ' ' + suggestion;
      const formattedComposition = textUtils.formatStringIntoSentence(newComposition);
      setComposition(formattedComposition);
      setUserInput('');
      const tokens = parseStringIntoTokens(formattedComposition);
      queueSuggestionUpdate(tokens, currentSource, suggestionAccuracy, numSuggestions);
    }
  };

  const handleWordClick = (wordIndex) => {
    console.log('Word clicked at index ', wordIndex);
    const compositionArray = composition.split(' ');
    const predecessors = compositionArray.slice(0, wordIndex);
    let tokens = [];
    for (let word of predecessors) { 
      const token = parseStringIntoTokens(word)[0];
      if (token) {
        tokens.push(token);
      }
    }
    suggestionService.retrieveSuggestion(tokens, currentSource, suggestionAccuracy, 1)
      .then(suggestion => {
        compositionArray[wordIndex] = suggestion;
        const newComposition = textUtils.formatWordArrayIntoSentence(compositionArray);
        setComposition(newComposition);
      });
  };

  const handleShowSuggestionPreviewChange = () => {
    const newValue = !suggestionOptions.showSuggestionPreview;
    const updatedOptions = {...suggestionOptions, showSuggestionPreview: newValue};
    setSuggestionOptions(updatedOptions);
  }

  const handleNumSuggestedWordsChange = (event) => {
    const newAmount = Number(event.target.value);
    const updatedOptions = {...suggestionOptions, numSuggestedWords: newAmount}
    setSuggestionOptions(updatedOptions);
    const tokens = getAllCurrentTokens();
    queueSuggestionUpdate(tokens, currentSource, suggestionAccuracy, newAmount)
  }
  
  const handleSuggestionAccuracyChange = (event) => {
    const newAccuracy = Number(event.target.value);
    const updatedOptions = {...suggestionOptions, suggestionAccuracy: newAccuracy}
    setSuggestionOptions(updatedOptions);
    const tokens = getAllCurrentTokens();
    queueSuggestionUpdate(tokens, currentSource, newAccuracy, numSuggestions);
  }

  const deleteComposition = () => {
    if (composition && confirm('Are you sure you want to delete your composition?')) {
      const newComposition = '';
      setComposition(newComposition);
      const tokens = parseStringIntoTokens(userInput);
      queueSuggestionUpdate(tokens, currentSource, suggestionAccuracy, numSuggestions);
    }
  }

  const deleteLastWordOfComposition = () => {
    if (composition) {
      const compositionArray = composition.split(' ');
      compositionArray.pop();
      const newComposition = textUtils.formatWordArrayIntoSentence(compositionArray);
      setComposition(newComposition);
      const tokens = parseStringIntoTokens(newComposition + ' ' + userInput);
      queueSuggestionUpdate(tokens, currentSource, suggestionAccuracy, numSuggestions);
    }
  }

  const handleSearchResultClick = (result) => {
    console.log(result);
    // Create a new source from result and add it to sources, set it as currentsource
    // Need to make queueUpdateSuggestion work differently if currentSource.local === true

    // Pull formattedtext with bookService 
    // Process text into successorTable
    // Set localSuccessorTables to be the table
    // Only allow up to 3 local tables
    // Create a retrieveLocalSuggestion function 
  }



  return (
    <div>
      {/* TODO: <Header /> */}
      <h1>GhostWriter</h1>
      {notification}
      {welcomeVisible && <Welcome />}
      {/* <Hint text='' /> */}
      <CompositionDisplay
        composition={composition}
        userInput={userInput}
        suggestion={suggestion}
        showPreview={suggestionOptions.showSuggestionPreview}
        onWordClick={handleWordClick}
      />
      <WritingForm
        style={{ float: 'none' }}
        onSubmit={handleWritingSubmit}
        onChange={handleWritingChange}
        value={userInput}
      />
      <SourceSelector
        sources={sources}
        value={currentSource.id}
        onChange={handleSourceSelection}
      />
      <Button label="Delete composition" onClick={deleteComposition}/>
      <Button label="Delete previous word" onClick={deleteLastWordOfComposition}/>
      <OptionsMenu>
        <CheckboxInput
          label={"Show preview of ghostwriter's suggestion:"}
          value={suggestionOptions.showSuggestionPreview}
          onChange={handleShowSuggestionPreviewChange}
        />
        <NumberInput
          value={numSuggestions}
          onChange={handleNumSuggestedWordsChange}
          min="0"
          max="500"
          label={"Number of words ghostwriter suggests:"}
        />
        <NumberInput
          value={suggestionAccuracy}
          onChange={handleSuggestionAccuracyChange}
          min="0"
          max="3"
          label={"Suggestion accuracy:"}
        />
      </OptionsMenu>
      <GutenbergSearch onResultClick={handleSearchResultClick} />

      {/* TODO: <Footer/> */}
    </div>
  );
};

export default App;
