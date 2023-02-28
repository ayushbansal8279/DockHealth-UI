import React, { useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as ActionTypes from 'actions/action-types';
import { PatientEditContext } from 'context-api/patient-edit-context';
import { selectedUserOrganizationSelector } from 'selectors/user-selectors';
import { BulkEditOptionsConfig } from 'helpers/bulk-edit-helpers';
import BulkEditOptionsBar from './BulkEditOptionsBar/BulkEditOptionsBar';
import { BulkEditOptionsBarContainer } from './styled';

const BulkEditSection = ({ children }) => {
  const PatientContext = useContext(PatientEditContext);

  const {
    bulkEditIsActive,
    selectedPatients,
    selectedOptionsHandler,
  } = PatientContext;

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const restrictedConfig = {};
  const setConfig = (configName, themeSettingName) => {
    const enabledItem =
      currentOrganization?.themeSettings?.find(
        ({ name }) => name === themeSettingName,
      ) || {};
    const enabledValue = enabledItem?.value !== 'false';
    restrictedConfig[configName] = enabledValue;
  };
  setConfig(
    BulkEditOptionsConfig.DUPLICATE_OPTION,
    'bulk.option.duplicate.enabled',
  );
  setConfig(BulkEditOptionsConfig.MOVE_OPTION, 'bulk.option.move.enabled');
  setConfig(
    BulkEditOptionsConfig.COMPLETE_OPTION,
    'bulk.option.complete.enabled',
  );
  setConfig(BulkEditOptionsConfig.STATUS_OPTION, 'bulk.option.status.enabled');
  setConfig(
    BulkEditOptionsConfig.DUE_DATE_OPTION,
    'bulk.option.duedate.enabled',
  );
  setConfig(BulkEditOptionsConfig.DELETE_OPTION, 'bulk.option.delete.enabled');

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
              optionsConfig={restrictedConfig}
            />
          )}
        </BulkEditOptionsBarContainer>
      </>
    )
  );
};

export default BulkEditSection;
