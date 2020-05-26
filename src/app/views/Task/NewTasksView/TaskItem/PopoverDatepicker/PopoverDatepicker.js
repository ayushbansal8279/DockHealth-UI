import React, { useState, useRef } from 'react';
import { Popover } from '@material-ui/core';

import Datepicker from 'components/common/Datepicker/Datepicker';

const PopoverDatepicker = ({ selectedDate, children }) => {
  const buttonReference = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleDatePick = pickedDate => {
    setIsOpen(false);
    console.log('date change', pickedDate);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        ref={buttonReference}
      >
        {children}
      </button>
      <Popover
        anchorEl={buttonReference?.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Datepicker selectedDate={selectedDate} onDateChange={handleDatePick} />
      </Popover>
    </>
  );
};

export default PopoverDatepicker;
