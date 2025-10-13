import React from 'react';
import FilterDateInput from '../FilterDateInput/FilterDateInput';

const SingleDateOption = ({ date, setDate }) => {
  return (
    <div style={{ width: '100px' }}>
      <FilterDateInput singleDate date={date} setSingleDateInput={setDate} />
    </div>
  );
};

export default SingleDateOption;
