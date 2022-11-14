import React from 'react';
import { useState } from 'react';
import Welcome from './components/Welcome';
import SourceSelector from './components/SourceSelector'

const App = () => {
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [source, setSource] = useState('shakespeare');

  return (
    <div className='container'>
      {welcomeVisible && <Welcome/>}
      <SourceSelector source={source}/>
    </div>
  )
}

export default App;