import React, { useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as ActionTypes from 'actions/action-types';
import BulkEditOptionsBar from './BulkEditOptionsBar/BulkEditOptionsBar';
import { PatientEditContext } from '../PatientsView'
import { BulkEditOptionsBarContainer } from './styled';

const BulkEditSection = ({ children }) => {
  const PatientContext = useContext(PatientEditContext);

  const { bulkEditIsActive, selectedPatients } = PatientContext;

  const dispatch = useDispatch();

  const onClose = useCallback(() => {
    dispatch({
      type: ActionTypes.UNSELECT_ALL_PATIENTS,
    });
  }, [dispatch]);

  return (
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
  );
};

export default BulkEditSection;
