import React, { useContext, useCallback } from 'react';

import BulkEditBar from 'components/bulk-edit/BulkEditBar/BulkEditBar';
import BulkEditOption from 'components/bulk-edit/BulkEditOption/BulkEditOption';
import { PatientEditContext } from '../../PatientsView';

import DuplicateIcon from 'img/bulk-edit/DuplicateIcon';
import CompleteIcon from 'img/bulk-edit/CompleteIcon';
import StatusIcon from 'img/bulk-edit/StatusIcon';
import DeleteIcon from 'img/bulk-edit/DeleteIcon';

import palette from 'styles/palette';
import { Button } from './styled';

const BulkEditOptionsBar = ({ selectedPatients = {}, onClose }) => {
  const patientContext = useContext(PatientEditContext);

  const { selectedOptionsHandler } = patientContext;
  const {
    toggleCreateTaskOption,
    toggleCreateWorkflowOption,
    toggleAddLabelOption,
    toggleDeleteOption,
    turnOffAllOptions,
  } = selectedOptionsHandler;

  const createTaskHandler = useCallback(() => {
    turnOffAllOptions();
    toggleCreateTaskOption();
  }, [toggleCreateTaskOption, turnOffAllOptions]);

  const createWorkflowHandler = useCallback(() => {
    turnOffAllOptions();
    toggleCreateWorkflowOption();
  }, [toggleCreateWorkflowOption, turnOffAllOptions]);

  const addLabelHandler = useCallback(() => {
    turnOffAllOptions();
    toggleAddLabelOption();
  }, [toggleAddLabelOption, turnOffAllOptions]);

  const deleteHandler = useCallback(() => {
    turnOffAllOptions();
    toggleDeleteOption();
  }, [toggleDeleteOption, turnOffAllOptions]);

  return (
    <BulkEditBar
      numberOfSelectedItems={selectedPatients?.length}
      onClose={onClose}
      patientView
    >
      <>
        <Button type="button" onClick={createTaskHandler} disabled={false}>
          <BulkEditOption
            iconComponent={CompleteIcon}
            title="Create Task"
            isDisabled={false}
            wideView
          />
        </Button>
        <Button type="button" onClick={createWorkflowHandler} disabled={false}>
          <BulkEditOption
            iconComponent={DuplicateIcon}
            title="Create Workflow"
            isDisabled={false}
            wideView
          />
        </Button>
        <Button type="button" onClick={addLabelHandler} disabled={false}>
          <BulkEditOption
            iconComponent={StatusIcon}
            title="Add Label"
            isDisabled={false}
            wideView
          />
        </Button>
        <Button type="button" onClick={deleteHandler} disabled={false}>
          <BulkEditOption
            iconComponent={DeleteIcon}
            title="Delete"
            color={palette.oPlusRed}
            isDisabled={false}
            wideView
          />
        </Button>
      </>
    </BulkEditBar>
  );
};

export default BulkEditOptionsBar;
