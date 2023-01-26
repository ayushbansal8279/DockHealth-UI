import React, { useState, useEffect } from 'react';
import moment from 'moment';
// eslint-disable-next-line import/no-named-as-default
import { useBoolean } from 'hooks/useBoolean';
import Datepicker from 'components/common/Datepicker/Datepicker';
import TimeDropdownInput from 'components/common/TimeDropdownInput/TimeDropdownInput';
import PopoverBottomBar from 'components/task/PopoverBottomBar/PopoverBottomBar';
import { TIME_12H_FORMAT } from 'helpers/task-drawer-helpers';
import SecondaryDateInput from 'components/common/SecondaryDateInput/SecondaryDateInput';
import {
  ContentWrapper,
  Divider,
  QuickAddSectionWrapper,
  QuickSelectButton,
  PlusButton,
  SectionWrapper,
  Label,
  AddSectionWrapper,
} from './styled';
import RecurringSection from './RecurringSection';

const DATE_ISO_FORMAT = 'YYYY-MM-DD';
export const DATE_MASK_FORMAT = 'MM/DD/YYYY';

const DueDatePicker = ({
  taskIdentifier,
  selectedDate,
  onDateChange,
  recurring,
  disableRecurring,
  onCloseClick,
  disableClearDate,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const [recurringSectionVisible, showRecurringSection] = useBoolean(recurring);
  const [dateMaskValue, setDateMaskValue] = useState(
    selectedDate ? moment(selectedDate).format(DATE_MASK_FORMAT) : null,
  );
  const [timeMaskValue, setTimeMaskValue] = useState(
    selectedDate ? moment(selectedDate).format(TIME_12H_FORMAT) : null,
  );
  const [dateValue, setDateValue] = useState(selectedDate);
  const momentSelectedDate = selectedDate
    ? moment(dateValue, DATE_ISO_FORMAT)
    : null;

  useEffect(() => {
    if (selectedDate !== dateValue) {
      setDateMaskValue(moment(selectedDate).format(DATE_MASK_FORMAT));
      setTimeMaskValue(moment(selectedDate).format(TIME_12H_FORMAT));
      setDateValue(selectedDate);
    }
  }, [dateValue, selectedDate]);

  const handleDatePick = (pickedDate) => {
    setDateValue(pickedDate);
    const formattedToMask = moment(pickedDate).format(DATE_MASK_FORMAT);
    setDateMaskValue(formattedToMask);

    onDateChange(
      moment(
        `${pickedDate} ${timeMaskValue}`,
        `${DATE_ISO_FORMAT} ${TIME_12H_FORMAT}`,
      ).toISOString(),
    );
  };

  const handleTimePick = (pickedTime) => {
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

  const handleInsertDateAsText = () => {
    const areSomeMissingParts = dateMaskValue.includes('_');

    if (areSomeMissingParts) {
      return;
    }

    const momentDate = moment(dateMaskValue, DATE_MASK_FORMAT);
    const validDate = momentDate.isValid();
    if (!validDate) {
      return;
    }
    const formattedDate = momentDate.format(DATE_ISO_FORMAT);
    handleDatePick(formattedDate);
  };

  return (
    <ContentWrapper>
      <QuickAddSectionWrapper>
        <AddSectionWrapper>
          <Label>Date</Label>
          <SecondaryDateInput
            popoverDisabled
            value={dateMaskValue}
            onChange={setDateMaskValue}
            onEnter={handleInsertDateAsText}
            onBlur={handleInsertDateAsText}
          />
        </AddSectionWrapper>
        <AddSectionWrapper>
          <Label>Time</Label>
          <TimeDropdownInput
            type="secondary"
            savedValue={timeMaskValue}
            onSave={handleTimePick}
            disabled={!selectedDate}
            hideError
          />
        </AddSectionWrapper>
      </QuickAddSectionWrapper>
      <Divider />
      <QuickAddSectionWrapper>
        <QuickSelectButton
          fillWidth
          type="button"
          isSelected={momentSelectedDate?.isSame(moment(), 'd')}
          onClick={() => handleDatePick(moment().format(DATE_ISO_FORMAT))}
        >
          Today
        </QuickSelectButton>
        <QuickSelectButton
          type="button"
          isSelected={momentSelectedDate?.isSame(
            moment().add(1, 'days'),
            'day',
          )}
          onClick={() =>
            handleDatePick(moment().add(1, 'days').format(DATE_ISO_FORMAT))
          }
        >
          Tomorrow
        </QuickSelectButton>
      </QuickAddSectionWrapper>
      <Divider />
      <Datepicker selectedDate={dateValue} onDateChange={handleDatePick} />
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
            </>
          )}
        </>
      )}
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
    </ContentWrapper>
  );
};

export default React.memo(DueDatePicker);
