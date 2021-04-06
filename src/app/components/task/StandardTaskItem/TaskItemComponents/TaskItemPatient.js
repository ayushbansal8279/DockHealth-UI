import React, { useCallback } from 'react';
import PatientCard from 'components/patients/PatientCard/PatientCard';
import Highlighter from 'react-highlight-words';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import { storeAsCurrentTask } from 'actions/task-actions';
import { openDrawer } from 'actions/task-drawer-actions';
import {
  AddPlaceholder,
  ClickablePatient,
  StandardTaskItemCell,
  ListItemLink,
} from '../../styled';

const TaskItemPatient = ({
  highlightedValue,
  taskStatus,
  isSubtask,
  parentHasPatient,
  matchPatientMRN,
  patient,
  matchPatient,
  task,
  dispatch,
}) => {
  const onPatientClick = useCallback(() => {
    if (!patient) {
      dispatch(openDrawer(DrawerFieldEnum.PATIENT));
      dispatch(storeAsCurrentTask(task));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient, task]);

  const patientName = patient?.middleName
    ? `${patient?.lastName}, ${patient?.firstName} ${patient?.middleName?.slice(
        0,
        1,
      )}`
    : `${patient?.lastName}, ${patient?.firstName}`;

  return (
    <StandardTaskItemCell width="164px">
      <ClickablePatient onClick={onPatientClick}>
        {taskStatus !== 'COMPLETE' && !isSubtask && !patient && (
          <AddPlaceholder>+ Add Patient</AddPlaceholder>
        )}
        {patient && !parentHasPatient && (
          <PatientCard patientIdentifier={patient.patientIdentifier}>
            <ListItemLink to={`/core/patient/${patient.patientIdentifier}`}>
              {(matchPatient || matchPatientMRN) && highlightedValue ? (
                <Highlighter
                  highlightClassName="list-highlight"
                  searchWords={
                    matchPatient
                      ? highlightedValue?.toLowerCase().split(/\s+/)
                      : `${patientName}`.toLowerCase().split(/\s+/)
                  }
                  autoEscape
                  textToHighlight={`${patient.patientName}`}
                />
              ) : (
                `${patientName}`
              )}
            </ListItemLink>
          </PatientCard>
        )}
      </ClickablePatient>
    </StandardTaskItemCell>
  );
};

export default TaskItemPatient;
