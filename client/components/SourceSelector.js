import React from 'react';

const formatSource = (source) => {
  if (!source.author) {
    return source.title;
  }
  return `${source.author} - ${source.title}`;
}

const SourceSelector = ({ sources, value, onChange }) => {
  
  return (
    <div style={{padding: '10px'}}>
        <div style={{float: 'left'}}>
          Now co-writing with: 
        </div>
        <select value={value} onChange={onChange}>
          {sources.map((source) => (
            <option key={source.id} value={source.id}>{formatSource(source)}</option>
          ))}
        </select>
    </div>
  );
};

export default SourceSelector;
