import React from 'react';
import { useState } from 'react';
import Welcome from './components/Welcome';
import SourceSelector from './components/SourceSelector';
import WordForm from './components/WordForm';
import sourceData from './sourceData';

const App = () => {
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [source, setSource] = useState('shakespeare');
  const [sentenceArray, setSentenceArray] = useState(['this', 'is', 'a', 'test', 'sentence']);
  const [wordInput, setWordInput] = useState('');

  const addWordsToSentence = (word1, word2) => {
    //TODO: check if ends in a period, or is a period, or a comma
    const updatedSentence = sentenceArray.concat(word1, word2);
    setSentenceArray(updatedSentence);
  }
  
  //TODO:
  const generateSuccessorFrom = (word) => {
    return 'dingo'
  }

  const handleSourceSelection = (event) => {
    if (welcomeVisible) {
      setWelcomeVisible(false);
    }
    setSource(event.target[0].value);
    console.log('source changed to', event.target[0].value);
  };

  const handleWordChange = (event) => {
    setWordInput(event.target.value);
  }

  const handleWordSubmit = (event) => {
    event.preventDefault();
    const cowriterWord = generateSuccessorFrom(wordInput);
    addWordsToSentence(wordInput, cowriterWord);
    setWordInput('');
  };

  return (
    <div>
      {/* TODO: <Header /> */}
      <h1>Co-Writer</h1>
      {welcomeVisible && <Welcome />}
      {/* TODO: <SentenceDisplay sentence={sentence} onClick={handleWordUpdate}/> */}
      <div>{sentenceArray}</div>
      <WordForm 
        onSubmit={handleWordSubmit} 
        onChange={handleWordChange}
        value={wordInput}  
      />
      <SourceSelector
        sources={sourceData.map((s) => s.name)}
        onChange={handleSourceSelection}
      />
      TODO: Preview co-writer's suggestion:<input type='checkbox'></input>

      {/* TODO: <Footer/> */}
    </div>
  );
};

export default App;
