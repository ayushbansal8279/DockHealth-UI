import React from 'react';
import moment from 'moment';
import CalendarIcon from 'img/bulk-edit/CalendarIcon';
import PopoverDatepicker from 'components/common/PopoverDatepicker/PopoverDatepicker';
import { IconButton, IconBox } from './styled';

const dueDateQuickSelectOptions = [
  {
    label: 'Today',
    date: moment(),
  },
  {
    label: 'Tomorrow',
    date: moment().add(1, 'days'),
  },
];

const BulkEditDueDateOption = ({ handleChangeDateTasks, isDisabled }) => (
  <PopoverDatepicker
    onDateChange={date => {
      handleChangeDateTasks(date);
    }}
    quickSelectOptions={dueDateQuickSelectOptions}
    openCalendarWithOptions
    usePortal
  >
    {({ elementReference, setIsPopoverOpen, isPopoverOpen }) => (
      <IconButton
        type="button"
        ref={elementReference}
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        disabled={isDisabled}
      >
        <IconBox>
          <CalendarIcon />
        </IconBox>
        <p>Date</p>
      </IconButton>
    )}
  </PopoverDatepicker>
);

export default BulkEditDueDateOption;
