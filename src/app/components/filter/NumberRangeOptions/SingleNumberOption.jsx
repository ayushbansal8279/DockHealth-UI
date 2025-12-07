import React from 'react';
import FilterNumberInput from '../FilterNumberInput/FilterNumberInput';

const SingleNumberOption = ({ value, setNumber }) => {
  return (
    <div style={{ width: '70px' }}>
      <FilterNumberInput
        singleNumber
        value={value}
        setSingleNumberInput={setNumber}
        placeholder="Number"
      />
    </div>
  );
};

export default SingleNumberOption;

