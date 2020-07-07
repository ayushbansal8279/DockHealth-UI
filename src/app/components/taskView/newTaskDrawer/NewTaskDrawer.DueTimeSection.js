/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as AlertActions from 'alert/actions';
import useBoolean from 'hooks/useBoolean';
import { AdornmentClear } from './NewTaskDrawer.Styled';
import {
  DueTimeLabelContainer,
  DueTimeInputMaskContainer,
  DueTimeInputMask,
  DueTimeErrorMessage,
} from './NewTaskDrawer.DueTimeSection.Styled';

const TIME_12H_FORMAT_REGULAR_EXPRESSION = /^(1[0-2]|0{0,1}[1-9]):([0-5]\d) [APap][Mm]$/;

const DueTimeSection = ({
  dueTimeReference,
  selectedTask,
  dueDateValue,
  isOverDue,
  setDueTimeValue,
  saveDueDate,
  setAutoSaveVisible,
}) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isFocus, setFocus, unsetFocus] = useBoolean(false);

  const dispatch = useDispatch();

  const clearDueTime = async () => {
    setDueTimeValue('dueTime', null);
    // eslint-disable-next-line no-param-reassign
    dueTimeReference.current.value = null;
    if (selectedTask && selectedTask.taskIdentifier != null) {
      try {
        setErrorMessage(null);
        await saveDueDate({
          updatedDueDate: dueDateValue,
          updatedDueTime: '',
        });
        setAutoSaveVisible();
      } catch {
        dispatch(
          AlertActions.showGlobalAlert(
            'Error updating due date and time, please try again later',
            'error',
          ),
        );
      }
    }
  };

  const isEmpty = !(
    dueTimeReference?.current?.value &&
    dueTimeReference?.current?.value !== '' &&
    dueTimeReference?.current?.value !== '__:__ __'
  );

  return (
    <div>
      <DueTimeLabelContainer>DUE TIME</DueTimeLabelContainer>
      <DueTimeInputMaskContainer hasError={!!errorMessage}>
        <DueTimeInputMask
          name="dueTime"
          ref={dueTimeReference}
          mask="19:59 AM"
          maskChar="_"
          formatChars={{
            '1': '[0-1]',
            '5': '[0-5]',
            '9': '[0-9]',
            A: '[APap]',
            M: '[Mm]',
          }}
          // mask={mask}
          // maskPlaceholder="00:00 AM"
          placeholder="00:00 AM"
          alwaysShowMask
          onBlur={event => {
            // console.log(event.target.value);
            if (!TIME_12H_FORMAT_REGULAR_EXPRESSION.test(event.target.value)) {
              setErrorMessage('Time must be between 12:00 AM and 11:59 PM');
              return;
            }
            setErrorMessage(null);
            saveDueDate({
              updatedDueDate: dueDateValue,
              updatedDueTime: event.target.value,
            });
            unsetFocus();
          }}
          onFocus={() => {
            setFocus();
          }}
          onChange={() => {
            setErrorMessage(null);
          }}
          isOverDue={isOverDue}
          isEmpty={isEmpty}
          isFocus={isFocus}
        />
        <AdornmentClear
          onClick={clearDueTime}
          style={{
            marginLeft: '20px',
            marginBottom: '2px',
          }}
        />
      </DueTimeInputMaskContainer>
      {errorMessage && (
        <DueTimeErrorMessage>{errorMessage}</DueTimeErrorMessage>
      )}
    </div>
  );
};

export default DueTimeSection;
