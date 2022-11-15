import React from 'react';

const SourceSelector = ({ sources, onChange }) => {
  return (
    <div style={{padding: '10px'}}>
        <div style={{float: 'left'}}>
          Now co-writing with: 
        </div>
        <select onChange={onChange}>
          {sources.map((option, index) => (
            <option key={index}>{option}</option>
          ))}
        </select>
    </div>
  );
};

export default SourceSelector;
