import React, { useContext, useCallback } from 'react';

import BulkEditBar from 'components/bulk-edit/BulkEditBar/BulkEditBar';
import BulkEditOption from 'components/bulk-edit/BulkEditOption/BulkEditOption';

import DuplicateIcon from 'img/bulk-edit/DuplicateIcon';
import CompleteIcon from 'img/bulk-edit/CompleteIcon';
import StatusIcon from 'img/bulk-edit/StatusIcon';
import DeleteIcon from 'img/bulk-edit/DeleteIcon';

import palette from 'styles/palette';
import { PatientEditContext } from 'context-api/PatientEditContext';
import { Button } from './styled';

const BulkEditOptionsBar = ({ selectedPatients = {}, onClose }) => {
  const patientContext = useContext(PatientEditContext);

  const { selectedOptionsHandler } = patientContext;
  const {
    toggleCreateTaskOption,
    toggleCreateWorkflowOption,
    toggleAddLabelOption,
    toggleDeleteOption,
  } = selectedOptionsHandler;

  const createTaskHandler = useCallback(() => {
    toggleCreateTaskOption();
  }, [toggleCreateTaskOption]);

  const createWorkflowHandler = useCallback(() => {
    toggleCreateWorkflowOption();
  }, [toggleCreateWorkflowOption]);

  const addLabelHandler = useCallback(() => {
    toggleAddLabelOption();
  }, [toggleAddLabelOption]);

  const deleteHandler = useCallback(() => {
    toggleDeleteOption();
  }, [toggleDeleteOption]);

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
