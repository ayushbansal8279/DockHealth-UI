import React, { useCallback, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as ActionTypes from 'actions/action-types';
import { PatientEditContext } from 'context-api/patient-edit-context';
import BulkEditOptionsBar from './BulkEditOptionsBar/BulkEditOptionsBar';
import { BulkEditOptionsBarContainer } from './styled';

const BulkEditSection = ({ children }) => {
  const PatientContext = useContext(PatientEditContext);

  const {
    bulkEditIsActive,
    selectedPatients,
    selectedOptionsHandler,
  } = PatientContext;

  const { turnOffAllOptions } = selectedOptionsHandler;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!bulkEditIsActive) {
      turnOffAllOptions();
    }
  }, [bulkEditIsActive, turnOffAllOptions]);

  const onClose = useCallback(() => {
    dispatch({
      type: ActionTypes.UNSELECT_ALL_PATIENTS,
    });
    turnOffAllOptions();
  }, [dispatch, turnOffAllOptions]);

  return (
    bulkEditIsActive && (
      <>
        {children}
        <BulkEditOptionsBarContainer isOpen={bulkEditIsActive}>
          {bulkEditIsActive && (
            <BulkEditOptionsBar
              selectedPatients={selectedPatients}
              onClose={onClose}
            />
          )}
        </BulkEditOptionsBarContainer>
      </>
    )
  );
};

export default BulkEditSection;
