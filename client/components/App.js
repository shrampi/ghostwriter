import React from 'react';
import { useState, useEffect } from 'react';
import bookService from '../services/bookService';
import { getSuccessorOf, parseTokensFromText } from '../utils/successorTable';
import initialSources from '../../initialSources.json';

import Welcome from './Welcome';
import SourceSelector from './SourceSelector';
import WritingForm from './WritingForm';
import SentenceDisplay from './SentenceDisplay';
import OptionsMenu from './OptionsMenu';
import CheckboxInput from './CheckboxInput';



const App = () => {
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [sources, setSources] = useState(initialSources);
  const [source, setSource] = useState();
  const [sentenceArray, setSentenceArray] = useState([]);
  const [showPreview, setShowPreview] = useState(true);
  const [uniqueSuccessor, setUniqueSuccessor] = useState(false);
  const [weightedSuccessor, setWeightedSuccessor] = useState(true);
  const [writingInput, setWritingInput] = useState('');
  const [tentativeSuccessor, setTentativeSuccessor] = useState('');

  const initializeSourceData = () => {
    const defaultSource = initialSources[0];
    setSource(defaultSource);
    setTentativeSuccessor(getSuccessorOf('.', defaultSource.table));
  }

  useEffect(initializeSourceData, []);

  const testLoadBook = () => {
    bookService.getBook(11);
  }

  useEffect(testLoadBook, []);

  /**
   * Returns a successor of the word using the App state's source material. 
   * 
   * @param {String} word 
   * @returns The successor word as a String.
   */
  const nextWord = (word) => {
    const exclude = uniqueSuccessor ? sentenceArray : [];
    return getSuccessorOf(word, source.table, exclude, weightedSuccessor);
  }

  /**
   * Update's the state's tentative successor, which is displayed alongside the constructed sentence.
   * Upon submitting a word, the tentative successor is added to the sentence.
   * 
   * @param {String} input A String which the successor is determined from. If no input is provided, the
   * function will use the state's sentenceArray. 
   */
  const updateTentativeSuccessor = (input) => {
    const inputTokens = parseTokensFromText(input);
    let predecessor = '.';
    if (inputTokens.length) {
      predecessor = inputTokens[inputTokens.length - 1];
    }
    else if (sentenceArray.length) {
      predecessor = sentenceArray[sentenceArray.length - 1];
    }
    setTentativeSuccessor(nextWord(predecessor));
  }

  const hideWelcomeText = () => {
    if (welcomeVisible) {
      setWelcomeVisible(false);
    }
  }

  const handleSourceSelection = (event) => {
    hideWelcomeText();
    setSource(event.target.value);
    updateTentativeSuccessor();
    console.log('source changed to', event.target.value);
  };

  const handleWritingChange = (event) => {
    hideWelcomeText();
    const input = event.target.value;
    setWritingInput(input);
    updateTentativeSuccessor(input);
  };

  const handleWritingSubmit = (event) => {
    event.preventDefault();
    hideWelcomeText();
    const tokens = parseTokensFromText(writingInput);
    const newSentence = sentenceArray.concat(tokens);
    if (tentativeSuccessor) {
      newSentence.push(tentativeSuccessor);
    }
    setSentenceArray(newSentence);
    updateTentativeSuccessor();
    setWritingInput('');
  };

  const handleWordClick = (wordIndex) => {
    let predecessor;
    if (wordIndex) {
      predecessor = sentenceArray[wordIndex - 1];
    } 
    else {
      predecessor = '.';
    }
    const updatedSentence = [...sentenceArray];
    updatedSentence[wordIndex] = nextWord(predecessor);
    setSentenceArray(updatedSentence);
  };

  return (
    <div>
      {/* TODO: <Header /> */}
      <h1>GhostWriter</h1>
      {welcomeVisible && <Welcome />}
      {/* <Hint text='' /> */}
      <SentenceDisplay
        sentenceArray={sentenceArray}
        writingInput={writingInput}
        successor={tentativeSuccessor}
        showPreview={showPreview}
        onWordClick={handleWordClick}
        onSuccessorClick={() => updateTentativeSuccessor()}
      />
      <WritingForm
        style={{ float: 'none' }}
        onSubmit={handleWritingSubmit}
        onChange={handleWritingChange}
        value={writingInput}
      />
      <SourceSelector
        sources={sources.map((s) => s.name)}
        onChange={handleSourceSelection}
      />
      <OptionsMenu>
        <CheckboxInput label={'Show preview of ghostwriter\'s suggestion:'} value={showPreview} onChange={() => setShowPreview(!showPreview)} />
        <CheckboxInput label={'Only suggest unique words:'} value={uniqueSuccessor} onChange={() => setUniqueSuccessor(!uniqueSuccessor)} />
        <CheckboxInput label={'Use weighted suggestions:'} value={weightedSuccessor} onChange={() => setWeightedSuccessor(!weightedSuccessor)} />
      </OptionsMenu>

      {/* TODO: <Footer/> */}
    </div>
  );
};

export default App;
