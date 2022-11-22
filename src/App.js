import React from 'react';
import { useState } from 'react';
import sourceData from './sourceData';
import Welcome from './components/Welcome';
import SourceSelector from './components/SourceSelector';
import WritingForm from './components/WritingForm';
import SentenceDisplay from './components/SentenceDisplay';
import SuccessorPreview from './components/SuccessorPreview';
import OptionsMenu from './components/OptionsMenu';
import CheckboxInput from './components/CheckboxInput';

const App = () => {
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [source, setSource] = useState('shakespeare');
  const [sentenceArray, setSentenceArray] = useState([
    'this',
    'is',
    'a',
    'test',
    'sentence',
  ]);

  const [showPreview, setShowPreview] = useState(false);
  const [uniqueSuccessor, setUniqueSuccessor] = useState(false);
  const [weightedSuccessor, setWeightedSuccessor] = useState(true);

  //TODO: get successor from actual source data
  //NOTE: could you accept multiple words? Look at all the words and see if they share any successors, if they do, add those to last word's successor weights.
  const generateSuccessorFrom = (word) => {
    switch(word.length){
      case 1:
        return 'one';
      case 2:
        return 'two';
      default:
        return 'dingo';
    }
  }

  const [writingInput, setWritingInput] = useState('');
  const [tentativeSuccessor, setTentativeSuccessor] = useState(generateSuccessorFrom(writingInput));

  const handleSourceSelection = (event) => {
    if (welcomeVisible) {
      setWelcomeVisible(false);
    }
    setSource(event.target.value);
    console.log('source changed to', event.target.value);
  };

  const handleWritingChange = (event) => {
    const word = event.target.value;
    setWritingInput(word);
    setTentativeSuccessor(generateSuccessorFrom(word));
  };

  // TODO: catch when multiple spaces are used between words, or punctuation, etc.
  // NOTE: this can be the same as what we use to parse resource text
  const parseArrayFromText = (text) => {
    return text.split(" ");
  }

  const addWordsToSentenceArray = (words) => {
    const newSentence = sentenceArray;
    words.map((word) => {
      if (word) {
        newSentence.push(word);
      }
    });

    setSentenceArray(newSentence);
  };

  const handleWordSubmit = (event) => {
    console.log('submitted');
    event.preventDefault();
    const newWords = parseArrayFromText(writingInput); 
    addWordsToSentenceArray([...newWords, tentativeSuccessor]);
    setWritingInput('');
    setTentativeSuccessor(generateSuccessorFrom(tentativeSuccessor));
  };

  const handlePreviewCheckboxChange = (checked) => {
    console.log('preview changed to', checked);
  };

  //TODO:
  const handleWordClick = (wordIndex) => {
    console.log('word clicked at', wordIndex);
  };

  return (
    <div>
      {/* TODO: <Header /> */}
      <h1>Co-Writer</h1>
      {welcomeVisible && <Welcome />}
      {/* <Hint text='' /> */}
      <SentenceDisplay
        sentence={sentenceArray}
        onWordClick={handleWordClick}
      />
      <WritingForm
        style={{ float: 'none' }}
        onSubmit={handleWordSubmit}
        onChange={handleWritingChange}
        value={writingInput}
      />
      <SourceSelector
        sources={sourceData.map((s) => s.name)}
        onChange={handleSourceSelection}
      />
      {showPreview && <SuccessorPreview previewWord={tentativeSuccessor}/>}
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
