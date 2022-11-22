import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SuccessorPreview = ({ previewWord }) => {
  return (
    <div>
      {`Co-writer will add ${previewWord}`}
    </div>
  );
};

SuccessorPreview.propTypes = {
  previewWord: PropTypes.string
}

export default SuccessorPreview;
