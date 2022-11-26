import React from 'react';
import { useState, useEffect } from 'react';
import Welcome from './components/Welcome';
import SourceSelector from './components/SourceSelector';
import WritingForm from './components/WritingForm';
import SentenceDisplay from './components/SentenceDisplay';
import OptionsMenu from './components/OptionsMenu';
import CheckboxInput from './components/CheckboxInput';
import initialSources from '../initialSources.json';
import { getSuccessorOf, parseTokensFromText } from './utils/successorTable';

const App = () => {
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [sources, setSources] = useState(initialSources);
  const [source, setSource] = useState();
  const [sentenceArray, setSentenceArray] = useState([]);
  const [showPreview, setShowPreview] = useState(true);
  const [uniqueSuccessor, setUniqueSuccessor] = useState(false);
  const [weightedSuccessor, setWeightedSuccessor] = useState(false);
  const [writingInput, setWritingInput] = useState('');
  const [tentativeSuccessor, setTentativeSuccessor] = useState('');

  const initializeSourceData = () => {
    const defaultSource = initialSources[0];
    setSource(defaultSource);
    setTentativeSuccessor(getSuccessorOf('.', defaultSource.table));
  }

  useEffect(initializeSourceData, []);

  const nextWord = (word) => {
    const exclude = uniqueSuccessor ? sentenceArray : [];
    return getSuccessorOf(word, source.table, exclude, weightedSuccessor);
  }

  const updateTentativeSuccessor = (inputTokens) => {
    let predecessor = ".";
    if (inputTokens && inputTokens.length) {
      predecessor = inputTokens[inputTokens.length - 1];
    }
    else if (sentenceArray.length) {
      predecessor = sentenceArray[sentenceArray.length - 1];
    }
    setTentativeSuccessor(nextWord(predecessor));
  }

  const handleSourceSelection = (event) => {
    if (welcomeVisible) {
      setWelcomeVisible(false);
    }
    setSource(event.target.value);
    updateTentativeSuccessor(parseTokensFromText(writingInput));
    console.log('source changed to', event.target.value);
  };

  const handleWritingChange = (event) => {
    const input = event.target.value;
    const inputTokens = parseTokensFromText(input)
    setWritingInput(input);
    updateTentativeSuccessor(inputTokens);
  };

  const handleWritingSubmit = (event) => {
    event.preventDefault();
    console.log('submitted: ', writingInput);
    console.log('successor: ', tentativeSuccessor);

    const tokens = parseTokensFromText(writingInput);
    const newSentence = sentenceArray.concat(tokens);
    if (tentativeSuccessor) {
      newSentence.push(tentativeSuccessor);
    }

    setSentenceArray(newSentence);
    updateTentativeSuccessor([]);
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
      <h1>Co-Writer</h1>
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
        <CheckboxInput label={'Show preview of co-writer\'s suggestion:'} value={showPreview} onChange={() => setShowPreview(!showPreview)} />
        <CheckboxInput label={'Only suggest unique words:'} value={uniqueSuccessor} onChange={() => setUniqueSuccessor(!uniqueSuccessor)} />
        <CheckboxInput label={'Use weighted suggestions:'} value={weightedSuccessor} onChange={() => setWeightedSuccessor(!weightedSuccessor)} />
      </OptionsMenu>

      {/* TODO: <Footer/> */}
    </div>
  );
};

export default App;
