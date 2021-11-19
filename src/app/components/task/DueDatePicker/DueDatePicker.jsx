import React from 'react';
import moment from 'moment';
// eslint-disable-next-line import/no-named-as-default
import { useBoolean } from 'hooks/useBoolean';
import Datepicker from 'components/common/Datepicker/Datepicker';
import TimeDropdownInput from 'components/common/TimeDropdownInput/TimeDropdownInput';
import PopoverBottomBar from 'components/task/PopoverBottomBar/PopoverBottomBar';
import TimeIcon from 'img/time';
import { TIME_12H_FORMAT } from 'helpers/task-drawer-helpers';
import {
  ContentWrapper,
  Divider,
  QuickAddSectionWrapper,
  QuickSelectButton,
  PlusButton,
  SectionWrapper,
} from './styled';
import RecurringSection from './RecurringSection';

const DATE_ISO_FORMAT = 'YYYY-MM-DD';

const DueDatePicker = ({
  taskIdentifier,
  selectedDate,
  onDateChange,
  recurring,
  disableRecurring,
  onCloseClick,
  disableClearDate,
}) => {
  const [recurringSectionVisible, showRecurringSection] = useBoolean(recurring);

  const momentSelectedDate = selectedDate ? moment(selectedDate) : null;
  const selectedTime = momentSelectedDate?.format(TIME_12H_FORMAT) || null;

  const handleDatePick = pickedDate => {
    onDateChange(
      moment(
        `${pickedDate} ${selectedTime}`,
        `${DATE_ISO_FORMAT} ${TIME_12H_FORMAT}`,
      ).toISOString(),
    );
  };

  const handleTimePick = pickedTime => {
    onDateChange(
      moment(
        `${moment(selectedDate).format(DATE_ISO_FORMAT)} ${pickedTime}`,
        `${DATE_ISO_FORMAT} ${TIME_12H_FORMAT}`,
      ).toISOString(),
    );
  };

  const handleShowRecurringSection = () => {
    if (!selectedDate) {
      handleDatePick(moment().format(DATE_ISO_FORMAT));
    }
    showRecurringSection();
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
            handleDatePick(
              moment()
                .add(1, 'days')
                .format(DATE_ISO_FORMAT),
            )
          }
        >
          Tomorrow
        </QuickSelectButton>
        <TimeDropdownInput
          type="secondary"
          savedValue={selectedTime}
          onSave={handleTimePick}
          disabled={!selectedDate}
          endAdornment={<img src={TimeIcon} alt="Arrow" />}
          hideError
        />
      </QuickAddSectionWrapper>
      <Divider />
      <Datepicker selectedDate={selectedDate} onDateChange={handleDatePick} />
      {!disableRecurring && (
        <>
          <Divider />
          {recurringSectionVisible ? (
            <RecurringSection
              taskIdentifier={taskIdentifier}
              selectedDueDate={selectedDate}
              recurring={recurring}
              onClose={onCloseClick}
            />
          ) : (
            <>
              <SectionWrapper>
                <PlusButton type="button" onClick={handleShowRecurringSection}>
                  Repeat
                </PlusButton>
              </SectionWrapper>
              <PopoverBottomBar align="spread">
                {!disableClearDate && (
                  <PopoverBottomBar.Button
                    type="button"
                    onClick={() => {
                      onDateChange(null);
                    }}
                  >
                    Clear Date
                  </PopoverBottomBar.Button>
                )}
                <PopoverBottomBar.Button type="button" onClick={onCloseClick}>
                  Close
                </PopoverBottomBar.Button>
              </PopoverBottomBar>
            </>
          )}
        </>
      )}
    </ContentWrapper>
  );
};

export default React.memo(DueDatePicker);
