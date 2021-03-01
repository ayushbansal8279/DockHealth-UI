import React from 'react';
import moment from 'moment';
import CalendarIcon from 'img/bulk-edit/CalendarIcon';
import PopoverDatepicker from 'components/common/PopoverDatepicker/PopoverDatepicker';
import { WrapperContainer, IconBox, Button } from './styled';

const BulkEditDueDateOption = ({ handleChangeDateTasks, isDisabled }) => {
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

  return (
    <PopoverDatepicker
      onDateChange={date => {
        const startTime = moment()
          .startOf('day')
          .format('HH:mm:ss.SSSZ');
        handleChangeDateTasks(`${date}T${startTime}`);
      }}
      quickSelectOptions={dueDateQuickSelectOptions}
      openCalendarWithOptions
      usePortal
    >
      {({ elementReference, setIsPopoverOpen, isPopoverOpen }) => (
        <Button
          type="button"
          ref={elementReference}
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          disabled={isDisabled}
        >
          <WrapperContainer disabled={isDisabled}>
            <IconBox>
              <CalendarIcon />
            </IconBox>
            <p>Date</p>
          </WrapperContainer>
        </Button>
      )}
    </PopoverDatepicker>
  );
};

export default BulkEditDueDateOption;
