import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const SourceSelector = ({ source }) => {
  return (
    <div>
      <Row>
        <Col>Select source material:</Col>
        <Col>
          <DropdownButton title="select source">
            <Dropdown.Item>Shakespeare's Complete Works</Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>
    </div>
  );
};

export default SourceSelector;
