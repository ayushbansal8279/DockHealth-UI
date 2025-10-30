import React, { useEffect } from 'react';
import moment from 'moment';
import Datepicker from 'components/common/Datepicker/Datepicker';
import TimeDropdownInput from 'components/common/TimeDropdownInput/TimeDropdownInput';
import PopoverBottomBar from 'components/task/PopoverBottomBar/PopoverBottomBar';
import TimeIcon from 'img/time.svg';
import { TIME_12H_FORMAT } from 'helpers/task-drawer-helpers';
import {
  ContentWrapper,
  Divider,
  QuickAddSectionWrapper,
  QuickSelectButton,
} from './styled';

const DATE_ISO_FORMAT = 'YYYY-MM-DD';

const DatePicker = ({
  selectedDate,
  onDateChange,
  onCloseClick,
  hideDateTime = false,
  showTime
}) => {
  const momentSelectedDate = showTime === true || showTime === undefined
    ? (selectedDate ? moment(selectedDate) : null)
    : (selectedDate ? moment.utc(selectedDate).startOf('day') : null);
  
  const selectedTime = showTime === true 
    ? momentSelectedDate?.format(TIME_12H_FORMAT) || null
    : showTime === false 
      ? null
      : momentSelectedDate?.format(TIME_12H_FORMAT) || null;

  const handleDatePick = (pickedDate) => {
    onDateChange(
      moment(
        `${pickedDate} ${selectedTime}`,
        `${DATE_ISO_FORMAT} ${TIME_12H_FORMAT}`,
      ),
    );
  };

  const handleTimePick = (pickedTime) => {
    onDateChange(
      moment(
        `${moment(momentSelectedDate).format(DATE_ISO_FORMAT)} ${pickedTime}`,
        `${DATE_ISO_FORMAT} ${TIME_12H_FORMAT}`,
      ),
    );
  };

  return (
    <ContentWrapper>
      <QuickAddSectionWrapper>
        <QuickSelectButton
          type="button"
          isSelected={momentSelectedDate?.isSame(moment(), 'd')}
          onClick={() => handleDatePick(moment().format(DATE_ISO_FORMAT))}
        >
          Today
        </QuickSelectButton>
        <QuickSelectButton
          type="button"
          isSelected={momentSelectedDate?.isSame(moment().add(1, 'days'), 'd')}
          onClick={() =>
            handleDatePick(moment().add(1, 'days').format(DATE_ISO_FORMAT))
          }
        >
          Tomorrow
        </QuickSelectButton>
        {!hideDateTime && (
          <TimeDropdownInput
            type="secondary"
            savedValue={selectedTime}
            onSave={handleTimePick}
            disabled={!selectedDate}
            endAdornment={<img src={TimeIcon} alt="Arrow" />}
            hideError
          />
        )}
      </QuickAddSectionWrapper>
      <Divider />
      <Datepicker selectedDate={selectedDate} showTime={showTime} onDateChange={handleDatePick} />
      <>
        <Divider />
        <PopoverBottomBar align="spread">
          <PopoverBottomBar.Button
            type="button"
            onClick={() => {
              onDateChange(null);
            }}
          >
            Clear Date
          </PopoverBottomBar.Button>
          <PopoverBottomBar.Button type="button" onClick={onCloseClick}>
            Close
          </PopoverBottomBar.Button>
        </PopoverBottomBar>
      </>
    </ContentWrapper>
  );
};

export default React.memo(DatePicker);
