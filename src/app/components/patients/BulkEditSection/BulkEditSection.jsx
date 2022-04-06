import React, { useCallback, useMemo, createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as ActionTypes from 'actions/action-types';
import BulkEditOptionsBar from './BulkEditOptionsBar';
import {
  selectedPatientsSelector
} from 'selectors/patients-selectors';
import { BulkEditOptionsBarContainer } from './styled';

export const BulkEditContext = createContext({});

const BulkEditSection = ({ children }) => {
  const allPatients = useSelector(selectedPatientsSelector);

  const selectedPatients = useMemo(() => {
    return allPatients?.filter(
      patient => patient?.isSelected === true && patient,
    );
  }, [allPatients]);

  const dispatch = useDispatch();

  const onClose = useCallback(() => {
    dispatch({
      type: ActionTypes.UNSELECT_ALL_PATIENTS,
    });
  }, [dispatch]);

  const bulkEditIsActive = useMemo(() => {
    return selectedPatients?.length > 0;
  }, [selectedPatients]);

  const providerValue = useMemo(
    () => ({
      bulkEditIsActive,
      selectedPatients,
    }),
    [bulkEditIsActive, selectedPatients],
  );
  return (
    <BulkEditContext.Provider value={providerValue}>
      {children}
      <BulkEditOptionsBarContainer isOpen={bulkEditIsActive}>
        {bulkEditIsActive && (
          <BulkEditOptionsBar
            selectedPatients={selectedPatients}
            onClose={onClose}
          />
        )}
      </BulkEditOptionsBarContainer>
    </BulkEditContext.Provider>
  );
};

export default BulkEditSection;
