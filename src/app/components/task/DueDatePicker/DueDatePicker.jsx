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
  DisabledRepeatHint,
} from './styled';
import RecurringSection from './RecurringSection';
import { DueDateIntent } from '@/app/helpers/task-helpers';
import { adjustDateForTimeZone } from './helpers';

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
  dueDateIntent,
  dateType = null,
  allSelectedTasksIdentifiers,
  allSelectedWorkflowIdentifiers,
  bulkEditDueDate = false,
  onClearDateClick,
  addTaskDrawer,
  addTaskDrawerRecurringSchedule,
  setAddTaskDrawerRecurringSchedule,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const [recurringSectionVisible, showRecurringSection, hideRecurringSection] =
    useBoolean(recurring);
  const [dateMaskValue, setDateMaskValue] = useState(
    selectedDate ? moment(selectedDate).format(DATE_MASK_FORMAT) : null,
  );
  const [timeMaskValue, setTimeMaskValue] = useState(
    selectedDate ? moment(selectedDate).format(TIME_12H_FORMAT) : null,
  );
  const [dateValue, setDateValue] = useState(selectedDate);

  useEffect(() => {
    if (selectedDate !== dateValue) {
      if (selectedDate) {
        setTimeMaskValue(moment(selectedDate).format(TIME_12H_FORMAT));
      }

      if (!selectedDate) {
        setDateMaskValue(null);
        setDateValue(null);
      } else {
        if (
          dateType === 'dueDate' &&
          (dueDateIntent === DueDateIntent.DATE || !dueDateIntent)
        ) {
          const adjustedDate = adjustDateForTimeZone(selectedDate);
          const formattedDate = adjustedDate?.utc().format(DATE_ISO_FORMAT);
          setDateMaskValue(moment(formattedDate).format(DATE_MASK_FORMAT));
          setDateValue(formattedDate);
        } else {
          setDateMaskValue(moment(selectedDate).format(DATE_MASK_FORMAT));
          setDateValue(selectedDate);
        }
      }
    }
  }, [dateValue, selectedDate]);

  const handleDatePick = (pickedDate) => {
    const formattedToMask = moment(pickedDate).format(DATE_MASK_FORMAT);
    setDateValue(pickedDate);
    setDateMaskValue(formattedToMask);

    if (
      dateType === 'dueDate' &&
      (dueDateIntent === DueDateIntent.DATE || !dueDateIntent)
    ) {
      const dateOnlyISO = moment(
        `${pickedDate}T00:00:00.000+00:00`,
      ).toISOString();
      onDateChange(dateOnlyISO);
    } else {
      onDateChange(
        moment(
          `${pickedDate} ${timeMaskValue}`,
          `${DATE_ISO_FORMAT} ${TIME_12H_FORMAT}`,
        ).toISOString(),
      );
    }
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
    const areSomeMissingParts = dateMaskValue?.includes('_');

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

  const handleClearDateClick = () => {
    if (onClearDateClick) {
      onClearDateClick(() => {
        onDateChange(null);
        setTimeMaskValue(null);
      });
    } else {
      // Fallback to direct clear if no callback provided
      onDateChange(null);
      setTimeMaskValue(null);
    }
  };

  return (
    <ContentWrapper>
      <QuickAddSectionWrapper>
        <AddSectionWrapper>
          <Label>Date</Label>
          <SecondaryDateInput
            popoverDisabled
            value={dateMaskValue || ''}
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
          isSelected={moment(dateMaskValue)?.isSame(moment(), 'd')}
          onClick={() =>
            handleDatePick(moment().startOf('day').format(DATE_ISO_FORMAT))
          }
        >
          Today
        </QuickSelectButton>
        <QuickSelectButton
          type="button"
          isSelected={moment(dateMaskValue)?.isSame(
            moment().add(1, 'days'),
            'day',
          )}
          onClick={() =>
            handleDatePick(
              moment().startOf('day').add(1, 'days').format(DATE_ISO_FORMAT),
            )
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
              allSelectedTasksIdentifiers={allSelectedTasksIdentifiers}
              allSelectedWorkflowIdentifiers={allSelectedWorkflowIdentifiers}
              bulkEditDueDate={bulkEditDueDate}
              addTaskDrawer={addTaskDrawer}
              addTaskDrawerRecurringSchedule={addTaskDrawerRecurringSchedule}
              setAddTaskDrawerRecurringSchedule={
                setAddTaskDrawerRecurringSchedule
              }
            />
          ) : (
            <>
              <SectionWrapper>
                <PlusButton
                  type="button"
                  onClick={handleShowRecurringSection}
                  disabled={!selectedDate}
                >
                  Repeat
                </PlusButton>
                {!selectedDate && (
                  <DisabledRepeatHint>
                    Select a date to enable repeating options
                  </DisabledRepeatHint>
                )}
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
              setTimeMaskValue(null);
              hideRecurringSection();
            }}
            disabled={!selectedDate && !bulkEditDueDate}
            theme={!selectedDate && !bulkEditDueDate ? 'light' : ''}
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
