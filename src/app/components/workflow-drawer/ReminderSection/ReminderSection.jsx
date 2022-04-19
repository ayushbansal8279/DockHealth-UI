import React, { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useForm, FormProvider } from 'react-hook-form';
import { isDueDateOverdue, ReminderType } from 'helpers/task-helpers';
import Checkbox from 'components/common/Checkbox/Checkbox';
import Spacing from 'components/common/Spacing';
import TimeDropdownInput from 'components/common/TimeDropdownInput/TimeDropdownInput';
import SecondaryDropdownInput from 'components/common/DropdownInput/SecondaryDropdownInput';
import ArrowIcon from 'img/arrow';
import { TIME_12H_FORMAT } from 'helpers/task-drawer-helpers';
import { useDispatch, useSelector } from 'react-redux';
import { workflowSelector } from 'selectors/workflow-drawer-selectors';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { ReminderContainer, Description, SelectArrowImg } from './styled';
import {
  REMINDER_TYPE_FIELD_NAME,
  REMINDER_TIME_FIELD_NAME,
  REMINDER_TYPE_OPTIONS,
} from './helpers';

// eslint-disable-next-line sonarjs/cognitive-complexity
const ReminderSection = ({ disabled }) => {
  const selectedWorkflow = useSelector(workflowSelector);
  const { reminderType, reminderTime = null, dueDateTime } =
    selectedWorkflow || {};
  const isDisabled = !dueDateTime || disabled;
  const reminderTypeDropdownReference = useRef(null);
  const formMethods = useForm();
  const { register, unregister, setValue, watch } = formMethods;
  const [reminderTypeValue, setReminderTypeValue] = useState(reminderType);
  const dispatch = useDispatch();

  useEffect(() => {
    register(REMINDER_TYPE_FIELD_NAME);
    register(REMINDER_TIME_FIELD_NAME);

    return () => {
      unregister(REMINDER_TYPE_FIELD_NAME);
      unregister(REMINDER_TIME_FIELD_NAME);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue(REMINDER_TYPE_FIELD_NAME, reminderType);
    setValue(REMINDER_TIME_FIELD_NAME, reminderTime);
    setReminderTypeValue(reminderType);
  }, [reminderTime, reminderType, setValue, setReminderTypeValue]);

  const handleReminderSave = useCallback(
    data => {
      dispatch(updatePartialWorkflow(selectedWorkflow?.identifier, data));
    },
    [dispatch, selectedWorkflow],
  );

  const isWorkflowDueDateOverdue = isDueDateOverdue(selectedWorkflow);
  const reminderIsOn = reminderTypeValue
    ? reminderTypeValue !== ReminderType.NONE
    : reminderType && reminderTypeValue !== ReminderType.NONE;

  const sectionDisabled =
    isDisabled || !reminderIsOn || isWorkflowDueDateOverdue;
  const reminderChecked = reminderIsOn && !isWorkflowDueDateOverdue;
  const isCheckboxDisabled = isDisabled || isWorkflowDueDateOverdue;

  const handleToggleReminder = useCallback(() => {
    if (isDisabled) return;

    if (!reminderTypeValue || reminderTypeValue === ReminderType.NONE) {
      const defaultType = ReminderType.DAY_OF;
      const defaultTime = null;

      setReminderTypeValue(defaultType);
      setValue(REMINDER_TYPE_FIELD_NAME, defaultType);
      setValue(REMINDER_TIME_FIELD_NAME, defaultTime);
      handleReminderSave({
        reminderType: defaultType,
        reminderTime: defaultTime,
      });
    } else {
      setReminderTypeValue(ReminderType.NONE);
      setValue(REMINDER_TYPE_FIELD_NAME, ReminderType.NONE);
      setValue(REMINDER_TIME_FIELD_NAME, null);
      handleReminderSave({
        reminderType: ReminderType.NONE,
        reminderTime: null,
      });
    }
  }, [
    handleReminderSave,
    reminderTypeValue,
    setValue,
    setReminderTypeValue,
    isDisabled,
  ]);

  const handleSelectReminderType = useCallback(
    value => {
      setValue(REMINDER_TYPE_FIELD_NAME, value);
      if (value === ReminderType.DAY_OF) {
        const defaultTime = undefined;
        setReminderTypeValue(value);
        setValue(REMINDER_TIME_FIELD_NAME, defaultTime);
        handleReminderSave({ reminderType: value, reminderTime: defaultTime });
      } else {
        handleReminderSave({ reminderType: value });
      }
    },
    [handleReminderSave, setValue, setReminderTypeValue],
  );

  const handleSelectReminderTime = useCallback(
    value => {
      setValue(REMINDER_TIME_FIELD_NAME, value);
      handleReminderSave({ reminderTime: value });
    },
    [handleReminderSave, setValue],
  );

  const validateReminderTime = useCallback(
    newValue => {
      const momentDueDate = moment(dueDateTime);

      if (
        reminderType === ReminderType.DAY_OF &&
        !(momentDueDate.hour() === 0 && momentDueDate.minute() === 0)
      ) {
        const momentReminderTime = moment(newValue, TIME_12H_FORMAT);
        const reminderMoment = momentDueDate
          .clone()
          .set('hour', momentReminderTime.hour())
          .set('minute', momentReminderTime.minute());

        if (reminderMoment.isAfter(momentDueDate)) {
          throw new Error('Past workflow due time');
        }
      }
      return true;
    },
    [dueDateTime, reminderType],
  );

  return (
    <FormProvider {...formMethods}>
      <ReminderContainer>
        <Checkbox
          isDisabled={isCheckboxDisabled}
          isChecked={reminderChecked ?? false}
          onClick={handleToggleReminder}
        />
        <Spacing horizontal={3} />
        <Description isDisabled={sectionDisabled}>Reminder</Description>
        <Spacing horizontal={3} />
        {!sectionDisabled && (
          <>
            <SecondaryDropdownInput
              ref={reminderTypeDropdownReference}
              name={REMINDER_TYPE_FIELD_NAME}
              value={watch(REMINDER_TYPE_FIELD_NAME)}
              placeholder="--"
              onSelect={handleSelectReminderType}
              disabled={sectionDisabled}
              width={130}
              options={REMINDER_TYPE_OPTIONS}
            />
            <Spacing horizontal={2} />
            <Description>at</Description>
            <Spacing horizontal={2} />
            <TimeDropdownInput
              type="secondary"
              savedValue={reminderTime}
              value={watch(REMINDER_TIME_FIELD_NAME)}
              onValueChange={newValue =>
                setValue(REMINDER_TIME_FIELD_NAME, newValue)
              }
              onSave={updatedReminderTime =>
                handleReminderSave({
                  reminderTime: updatedReminderTime,
                })
              }
              handleReminderSave={handleSelectReminderTime}
              disabled={sectionDisabled}
              endAdornment={<SelectArrowImg src={ArrowIcon} alt="arrow" />}
              validate={validateReminderTime}
            />
          </>
        )}
      </ReminderContainer>
    </FormProvider>
  );
};

export default ReminderSection;
