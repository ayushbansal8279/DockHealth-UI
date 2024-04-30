import React, { useContext, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  openModal as openModalAction,
  closeModal as closeModalAction,
} from 'modal/actions';

import BulkEditBar from 'components/bulk-edit/BulkEditBar/BulkEditBar';
import BulkEditOption from 'components/bulk-edit/BulkEditOption/BulkEditOption';
import * as PatientsActions from 'actions/patients-actions';

import DuplicateIcon from 'img/bulk-edit/DuplicateIcon';
import CompleteIcon from 'img/bulk-edit/CompleteIcon';
import StatusIcon from 'img/bulk-edit/StatusIcon';
import DeleteIcon from 'img/bulk-edit/DeleteIcon';
import DownloadIcon from 'img/bulk-edit/DownloadIcon';

import palette from 'styles/palette';
import { PatientEditContext } from 'context-api/patient-edit-context';
import { useLocation } from 'react-router-dom';
import UndoIcon from '@mui/icons-material/Undo';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { Button } from './styled';

const BulkEditOptionsBar = ({ selectedPatients = [], onClose }) => {
  const patientContext = useContext(PatientEditContext);
  const dispatch = useDispatch();

  const { pathname } = useLocation();

  const isArchivePage = pathname.includes('archived');

  const { selectedOptionsHandler } = patientContext;
  const {
    toggleCreateTaskOption,
    toggleCreateWorkflowOption,
    toggleAddLabelOption,
    toggleDeleteOption,
    toggleArchiveOption,
    toggleUnarchiveOption,
    downloadFiles,
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

  const editFieldsHandler = useCallback(() => {
    dispatch(
      openModalAction('PatientCustomFieldsBulkEdit', {
        patientIdentifiers: selectedPatients.map(
          ({ patientIdentifier }) => patientIdentifier,
        ),
        onSave: () => {
          dispatch(closeModalAction());
          dispatch(PatientsActions.silentlyGetCurrentPatients());
        },
      }),
    );
  }, [dispatch, selectedPatients]);

  const downloadFilesHandler = useCallback(() => {
    const selectedPatientIdentifiers = selectedPatients?.map((patient) => {
      return patient.patientIdentifier;
    });
    downloadFiles(selectedPatientIdentifiers);
  }, [downloadFiles, selectedPatients]);

  const deleteHandler = useCallback(() => {
    toggleDeleteOption();
  }, [toggleDeleteOption]);

  const archiveHandler = useCallback(() => {
    toggleArchiveOption();
  }, [toggleArchiveOption]);

  const unArchiveHandler = useCallback(() => {
    toggleUnarchiveOption();
  }, [toggleUnarchiveOption]);

  return (
    <BulkEditBar
      numberOfSelectedItems={selectedPatients?.length}
      onClose={onClose}
      patientView
    >
      <Button type="button" onClick={createTaskHandler} disabled={false}>
        <BulkEditOption
          iconComponent={CompleteIcon}
          title="Create Task"
          isDisabled={false}
        />
      </Button>
      <Button type="button" onClick={createWorkflowHandler} disabled={false}>
        <BulkEditOption
          iconComponent={DuplicateIcon}
          title="Create Workflow"
          isDisabled={false}
        />
      </Button>
      <Button type="button" onClick={addLabelHandler} disabled={false}>
        <BulkEditOption
          iconComponent={StatusIcon}
          title="Add Label"
          isDisabled={false}
        />
      </Button>
      <Button type="button" onClick={editFieldsHandler} disabled={false}>
        <BulkEditOption
          iconComponent={AppRegistrationIcon}
          title="Edit Fields"
          isDisabled={false}
        />
      </Button>
      <Button type="button" onClick={downloadFilesHandler} disabled={false}>
        <BulkEditOption
          iconComponent={DownloadIcon}
          title="Download Files"
          isDisabled={false}
        />
      </Button>
      {isArchivePage && (
        <Button type="button" onClick={deleteHandler} disabled={false}>
          <BulkEditOption
            iconComponent={DeleteIcon}
            title="Delete"
            color={palette.oPlusRed}
            isDisabled={false}
          />
        </Button>
      )}
      {!isArchivePage && (
        <Button type="button" onClick={archiveHandler} disabled={false}>
          <BulkEditOption
            iconComponent={DeleteIcon}
            title="Archive"
            color={palette.oPlusRed}
            isDisabled={false}
          />
        </Button>
      )}
      {isArchivePage && (
        <Button type="button" onClick={unArchiveHandler} disabled={false}>
          <BulkEditOption
            iconComponent={UndoIcon}
            title="Restore"
            isDisabled={false}
          />
        </Button>
      )}
    </BulkEditBar>
  );
};

export default BulkEditOptionsBar;
