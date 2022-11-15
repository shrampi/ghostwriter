import React from 'react';
import { useState } from 'react';

const SuccessorPreview = ({ onCheckboxChange, previewWord }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckbox = () => {
    onCheckboxChange(!isChecked);
    setIsChecked(!isChecked);
  };

  return (
    <div>
      Preview co-writer's addition: 
      <input
        type="checkbox"
        onChange={handleCheckbox}
        checked={isChecked}
      />
      {isChecked && <div>{`Co-writer will add ${previewWord}`}</div>}
    </div>
  );
};

export default SuccessorPreview;
