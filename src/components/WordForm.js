import React from 'react';

const WordForm = ({ onSubmit, onChange, value }) => {

  return (
    <div style={{padding: '10px'}}>
      <form onSubmit={onSubmit}>
        <input 
          style={{width: '40%'}} 
          placeholder="Start typing here"
          onChange={onChange}
          value={value}
        />
        <button type='submit'>Next</button>
      </form>
    </div>
  )
}

export default WordForm;
