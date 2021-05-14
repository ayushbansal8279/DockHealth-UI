import React, { useCallback, useEffect, useState } from 'react';
import { clone } from 'ramda';
import moment from 'moment';
import { Box } from '@material-ui/core';
import { FormContext, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import palette from 'styles/palette';
import {
  getTaskRecurringSchedule,
  saveTaskRecurringSchedule,
} from 'api/task-api';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import { setRecurringScheduleFlag } from 'actions/task-actions';
import AlertMessages from 'alert/AlertMessages';
import SecondaryDropdownInput from 'components/common/DropdownInput/SecondaryDropdownInput';
import Spacing from 'components/common/Spacing';
import DayOfWeekPicker from 'components/common/DayOfWeekPicker/DayOfWeekPicker';
import { DayOfWeek } from 'components/common/DayOfWeekPicker/helper';
import SecondaryNumberInput from 'components/common/NumberInput/SecondaryNumberInput';
import SecondaryDateInput from 'components/common/DateInput/SecondaryDateInput';
import {
  RecurringForm,
  SectionWrapper,
  BottomBar,
  ActionButton,
  FormRow,
  RowLabel,
  SelectWrapper,
} from './styled';
import {
  RECURRING_OPTIONS,
  FORM_DEFAULT_VALUES,
  FormField,
  ENDS_OPTIONS,
  EndsOption,
  RecurringOption,
  OPTIONS_ALLOWED_TO_DAY_SELECTION,
} from './helpers';

const RecurringSection = ({
  taskIdentifier,
  selectedDueDate,
  recurring,
  onClose,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const [endDateError, setEndDateError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const formContext = useForm({
    mode: 'onSubmit',
    defaultValues: !recurring ? FORM_DEFAULT_VALUES : undefined,
  });

  const { handleSubmit, setValue, watch, register, unregister } = formContext;
  const dispatch = useDispatch();

  const recurringOptionValue = watch(FormField.RECURRING_OPTION);
  const endsValue = watch(FormField.ENDS);
  const recurringOnDaysValue = watch(FormField.RECURRING_ON_DAYS);
  const numberOfOccurrencesValue = watch(FormField.NUMBER_OF_OCCURRENCES);

  const fillFormWithData = newData => {
    setValue(FormField.RECURRING_OPTION, newData[FormField.RECURRING_OPTION]);

    if (
      OPTIONS_ALLOWED_TO_DAY_SELECTION.includes(
        newData[FormField.RECURRING_OPTION],
      )
    ) {
      setValue(
        FormField.RECURRING_ON_DAYS,
        newData[FormField.RECURRING_ON_DAYS],
      );
    }

    if (newData[FormField.END_DATE]) {
      setValue(FormField.ENDS, EndsOption.ON_DATE);
      setValue(
        FormField.END_DATE,
        newData[FormField.END_DATE]
          ? moment(newData[FormField.END_DATE]).format('MM/DD/YYYY')
          : null,
      );
    } else if (newData[FormField.NUMBER_OF_OCCURRENCES]) {
      setValue(FormField.ENDS, EndsOption.AFTER_OCCURRENCES);
      setValue(
        FormField.NUMBER_OF_OCCURRENCES,
        newData[FormField.NUMBER_OF_OCCURRENCES],
      );
    } else {
      setValue(FormField.ENDS, EndsOption.NEVER);
    }
  };

  useEffect(() => {
    if (recurring) {
      getTaskRecurringSchedule(taskIdentifier)
        .then(data => {
          fillFormWithData(data);
        })
        .catch(() => {
          dispatch(showGlobalErrorAlert());
        });
    }

    register(FormField.RECURRING_ON_DAYS);
    register(FormField.NUMBER_OF_OCCURRENCES);
    register(FormField.END_DATE);

    return () => {
      unregister(FormField.RECURRING_ON_DAYS);
      unregister(FormField.NUMBER_OF_OCCURRENCES);
      unregister(FormField.END_DATE);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    switch (recurringOptionValue) {
      case RecurringOption.EVERYDAY_SUN_SAT:
        setValue(FormField.RECURRING_ON_DAYS, [
          DayOfWeek.SATURDAY,
          DayOfWeek.MONDAY,
          DayOfWeek.TUESDAY,
          DayOfWeek.WEDNESDAY,
          DayOfWeek.THURSDAY,
          DayOfWeek.FRIDAY,
          DayOfWeek.SUNDAY,
        ]);
        break;
      case RecurringOption.WEEKDAYS_MON_FRI:
        setValue(FormField.RECURRING_ON_DAYS, [
          DayOfWeek.MONDAY,
          DayOfWeek.TUESDAY,
          DayOfWeek.WEDNESDAY,
          DayOfWeek.THURSDAY,
          DayOfWeek.FRIDAY,
        ]);
        break;
      case RecurringOption.MONTHLY:
      case RecurringOption.YEARLY:
        setValue(FormField.RECURRING_ON_DAYS, null);
        break;
      case RecurringOption.DO_NOT_REPEAT:
        setValue(FormField.RECURRING_ON_DAYS, null);
        setValue(FormField.ENDS, EndsOption.NEVER);
        setValue(FormField.NUMBER_OF_OCCURRENCES, null);
        setValue(FormField.END_DATE, null);
        break;
      default:
        break;
    }
  }, [recurringOptionValue, setValue]);

  const recurringFormSubmit = useCallback(
    data => {
      const requestData = clone(data);

      if (requestData[FormField.END_DATE]) {
        const date = requestData[FormField.END_DATE];
        const momentDate = moment(date, 'MM/DD/YYYY');

        if (momentDate.isValid() && !date.includes('_')) {
          requestData[FormField.END_DATE] = momentDate.toISOString();
        } else {
          setEndDateError(true);
          return;
        }
      }

      setIsSaving(true);
      saveTaskRecurringSchedule(taskIdentifier, requestData)
        .then(() => {
          setIsSaving(false);

          const hasRecurringScheduleAfterSave =
            requestData[FormField.RECURRING_OPTION] !==
            RecurringOption.DO_NOT_REPEAT;

          if (recurring !== hasRecurringScheduleAfterSave) {
            dispatch(
              setRecurringScheduleFlag(
                taskIdentifier,
                hasRecurringScheduleAfterSave,
              ),
            );
          }
          dispatch(showGlobalAlert(AlertMessages.UPDATED));
          onClose();
        })
        .catch(() => {
          setIsSaving(false);
          dispatch(showGlobalErrorAlert());
        });
    },
    [dispatch, onClose, recurring, taskIdentifier],
  );

  const handleRecurringOptionSelect = newValue => {
    if ([RecurringOption.WEEKLY, RecurringOption.BIWEEKLY].includes(newValue)) {
      setValue(FormField.RECURRING_ON_DAYS, [
        moment(selectedDueDate)
          .format('dddd')
          .toUpperCase(),
      ]);
    }

    setValue(FormField.RECURRING_OPTION, newValue);
  };

  const handleRecurringOnDaysSelect = newValue => {
    setValue(FormField.RECURRING_ON_DAYS, newValue);
  };

  const handleEndsOptionSelect = newValue => {
    setValue(FormField.ENDS, newValue);

    switch (newValue) {
      case EndsOption.NEVER:
        if (endDateError) setEndDateError(false);
        setValue(FormField.NUMBER_OF_OCCURRENCES, null);
        setValue(FormField.END_DATE, null);
        break;
      case EndsOption.ON_DATE:
        setValue(FormField.NUMBER_OF_OCCURRENCES, null);
        setValue(FormField.END_DATE, null);
        break;
      case EndsOption.AFTER_OCCURRENCES:
        if (endDateError) setEndDateError(false);
        setValue(FormField.NUMBER_OF_OCCURRENCES, 1);
        setValue(FormField.END_DATE, null);
        break;
      default:
        break;
    }
  };

  return (
    <RecurringForm onSubmit={handleSubmit(recurringFormSubmit)}>
      <FormContext {...formContext}>
        <SectionWrapper>
          <FormRow>
            <RowLabel>Repeats every</RowLabel>
            <div>
              <SecondaryDropdownInput
                name={FormField.RECURRING_OPTION}
                placeholder="--"
                onSelect={handleRecurringOptionSelect}
                width={150}
                options={RECURRING_OPTIONS}
              />
            </div>
          </FormRow>
          <Spacing vertical={4} />
          <FormRow>
            <RowLabel>On</RowLabel>
            <DayOfWeekPicker
              values={recurringOnDaysValue}
              onSelect={handleRecurringOnDaysSelect}
              disabled={
                !OPTIONS_ALLOWED_TO_DAY_SELECTION.includes(recurringOptionValue)
              }
            />
          </FormRow>
          <Spacing vertical={4} />
          <FormRow>
            <RowLabel>Ends</RowLabel>
            <SelectWrapper>
              <SecondaryDropdownInput
                name={FormField.ENDS}
                placeholder="--"
                disabled={
                  recurringOptionValue === RecurringOption.DO_NOT_REPEAT
                }
                onSelect={handleEndsOptionSelect}
                width={150}
                options={ENDS_OPTIONS}
              />
              {endsValue === EndsOption.ON_DATE && (
                <>
                  <Spacing horizontal={3} />
                  <SecondaryDateInput
                    value={watch(FormField.END_DATE)}
                    error={endDateError}
                    onChange={event => {
                      setValue(FormField.END_DATE, event.target?.value);
                      if (endDateError) setEndDateError(false);
                    }}
                  />
                </>
              )}
              {endsValue === EndsOption.AFTER_OCCURRENCES && (
                <>
                  <Spacing horizontal={3} />
                  <SecondaryNumberInput
                    name={FormField.NUMBER_OF_OCCURRENCES}
                    value={numberOfOccurrencesValue}
                    onChange={newValue => {
                      if (newValue === '' || Number(newValue) > 0) {
                        setValue(
                          FormField.NUMBER_OF_OCCURRENCES,
                          newValue === '' ? '' : Number(newValue),
                        );
                      }
                    }}
                    onBlur={() => {
                      if (numberOfOccurrencesValue === '')
                        setValue(FormField.NUMBER_OF_OCCURRENCES, 1);
                    }}
                  />
                </>
              )}
            </SelectWrapper>
          </FormRow>
        </SectionWrapper>
        <BottomBar>
          <ActionButton
            type="button"
            textColor={palette.coolGrey1}
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </ActionButton>
          <Box m={0.5} />
          <ActionButton disabled={isSaving} type="submit">
            Save
          </ActionButton>
        </BottomBar>
      </FormContext>
    </RecurringForm>
  );
};

export default RecurringSection;
