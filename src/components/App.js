import React from 'react';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import bookService from '../services/bookService';
import sourcesService from '../services/sourcesService';
import suggestionService from '../services/suggestionService';

import textUtils from '../lib/textUtils';
import parseStringIntoTokens from '../lib/parseStringIntoTokens';
import removeGutenbergLabels from '../lib/removeGutenbergLabels';
import generateSuccessorTree from '../lib/generateSuccessorTree';
import findSuccessor from '../lib/findSuccessor';

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
federalist papers
idk at least like 20-30 options? 
*/

/*
TODO:
- Make sure suggestion update works with local source.
- Dropdown needs to select new source if it doesn't already
- Only allow up to 3 local sources
- Add composition to local storage. 

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
  
  const [options, setOptions] = useState({
    suggestionAccuracy: 3, // Articulate, intelligible, experimental, inebriated
    numSuggestedWords: 1, 
    showSuggestionPreview: true
  });

  const [showSearch, setShowSearch] = useState(false);

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
      })
      .catch((error) => {
        console.log('Error retrieving initial sources: ', error.message);
      });
  };

  useEffect(initializeSourcesHook, []);

  const updateSuggestionFromServer = () => {
    const tokens = parseStringIntoTokens(composition + ' ' + userInput);
    // Only allow server requests once server sources have been initialized.
    if (sources.server.length) {
      suggestionService.retrieveSuggestion(tokens, sources.current, options.suggestionAccuracy, options.numSuggestedWords)
        .then(suggestion => {
          setSuggestion(suggestion);
        });
    }
  }

  // FIXME: have it consistently update every 500ms, rather than waiting 500ms between updates?
  // Have the timeout handling up top, then do stuff based on timeout state? 
  const queueSuggestionUpdateFromServer = () => {
    const SUGGESTION_REQUEST_INTERVAL = 500;
    // Indicate suggestion is loading
    setSuggestion('...');
    // If there's no suggestion request timer active: 
    if (!suggestionRequestTimeout) {
      updateSuggestionFromServer();
      // start a timeout which will be the suggestionRequestTimeout. After 1 sec, will be set to null. 
      const timeoutID = setTimeout(() => {
        setSuggestionRequestTimeout(null);
      }, SUGGESTION_REQUEST_INTERVAL);
      setSuggestionRequestTimeout(timeoutID);
      return;
    }
    // If there is already a suggestion request timer active:
    // Clear the current timeout
    clearTimeout(suggestionRequestTimeout);
    // Create a new timeout that will update the suggestion after one second. 
    const timeoutID = setTimeout(() => {
      updateSuggestionFromServer();
      setSuggestionRequestTimeout(null);
    }, SUGGESTION_REQUEST_INTERVAL);
    setSuggestionRequestTimeout(timeoutID);
  }

  const updateSuggestionHook = () => {
    // Check if current source has local data
    if (!sources.current.tree) {
      queueSuggestionUpdateFromServer();
    }
    else {
      const tokens = parseStringIntoTokens(composition + ' ' + userInput);
      const suggestion = findSuccessor(sources.current.tree, tokens)
      setSuggestion(suggestion);
    }
  }

  useEffect(updateSuggestionHook, [composition, userInput, sources, options]);

  const handleSourceSelection = (event) => {
    const selectedID = event.target.value;
    const clientSourcesInfo = sources.client.map(source => ({...source, data: null}));
    const allSources = sources.server.concat(clientSourcesInfo);
    const newSource = allSources.find((source) => source.id === selectedID)
    const updatedSources = {...sources, current: newSource}
    setSources(updatedSources);
  };

  const handleWritingChange = (event) => {
    const newUserInput = event.target.value;
    setUserInput(newUserInput);
  };

  const handleWritingSubmit = (event) => {
    event.preventDefault();
    if (!suggestionRequestTimeout) {
      const newComposition = composition + ' ' + userInput + ' ' + suggestion;
      const formattedComposition = textUtils.formatStringIntoSentence(newComposition);
      setComposition(formattedComposition);
      setUserInput('');
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
    suggestionService.retrieveSuggestion(tokens, sources.current, options.suggestionAccuracy, 1)
      .then(suggestion => {
        compositionArray[wordIndex] = suggestion;
        const newComposition = textUtils.formatWordArrayIntoSentence(compositionArray);
        setComposition(newComposition);
      });
  };

  const handleShowSuggestionPreviewChange = () => {
    const newValue = !options.showSuggestionPreview;
    const updatedOptions = {...options, showSuggestionPreview: newValue};
    setOptions(updatedOptions);
  };

  const handleNumSuggestedWordsChange = (event) => {
    const newAmount = Number(event.target.value);
    const updatedOptions = {...options, numSuggestedWords: newAmount}
    setOptions(updatedOptions);
  }
  
  const handleSuggestionAccuracyChange = (event) => {
    const newAccuracy = Number(event.target.value);
    const updatedOptions = {...options, suggestionAccuracy: newAccuracy}
    setOptions(updatedOptions);
  }

  const deleteComposition = () => {
    if (composition && confirm('Are you sure you want to delete your composition?')) {
      setComposition('');
    }
  }

  const deleteLastWordOfComposition = () => {
    if (composition) {
      const compositionArray = composition.split(' ');
      compositionArray.pop();
      const newComposition = textUtils.formatWordArrayIntoSentence(compositionArray);
      setComposition(newComposition);
    }
  }

  // FIXME: 
  const createSourceFromSearchResult = (result) => {
    const gutenbergID = result.id;
    const newSource = {
      id: uuidv4(),
      title: result.title,
      author: result.authors,
    }
    console.log('New source information: ', newSource);
    console.log('Retrieving text from Project Gutenberg...')
    return bookService.getBook(gutenbergID).then(book => {
      const formattedText = removeGutenbergLabels(book);
      console.log('First 50 chars of book: ', formattedText.slice(0, 50));
      console.log('Generating successor tree...');
      const tree = generateSuccessorTree(formattedText);
      console.log('Successor tree generated.');
      console.log('Successors of THE: ', tree['the']);
      newSource.tree = tree;
      return newSource;
    });
  }

  const handleSearchResultClick = (result) => {
    console.log('Selected result: ', result);
    createSourceFromSearchResult(result).then(source => {
      console.log('Adding source to state...');
      const newClientSources = sources.client.concat(source);
      setSources({ ...sources, client: newClientSources, current: source });
      console.log('Done');
      console.log('Char length of data: ', JSON.stringify(source.tree).length);
    });
    setShowSearch(false);
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
        showPreview={options.showSuggestionPreview}
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
        onChange={handleSourceSelection}
      />
      <Button label="Delete composition" onClick={deleteComposition}/>
      <Button label="Delete previous word" onClick={deleteLastWordOfComposition}/>
      <OptionsMenu>
        <CheckboxInput
          label={"Show preview of ghostwriter's suggestion:"}
          value={options.showSuggestionPreview}
          onChange={handleShowSuggestionPreviewChange}
        />
        <NumberInput
          value={options.numSuggestedWords}
          onChange={handleNumSuggestedWordsChange}
          min="0"
          max="100"
          label={"Number of words ghostwriter suggests:"}
        />
        <NumberInput
          value={options.suggestionAccuracy}
          onChange={handleSuggestionAccuracyChange}
          min="0"
          max="3"
          label={"Suggestion accuracy:"}
        />
      </OptionsMenu>
      <button onClick={() => setShowSearch(!showSearch)}>{showSearch ? 'Hide Search Bar' : 'Search Bar'}</button>
      {showSearch && <GutenbergSearch onResultClick={handleSearchResultClick} />}

      {/* TODO: <Footer/> */}
    </div>
  );
};

export default App;
