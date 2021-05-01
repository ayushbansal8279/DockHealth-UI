import React, { useCallback, useState } from 'react';
import PatientCard from 'components/patients/PatientCard/PatientCard';
import PatientDropdown from 'components/patients/PatientDropdown/PatientDropdown';
import Highlighter from 'react-highlight-words';
import {
  AddPlaceholder,
  ClickablePatient,
  StandardTaskItemCell,
  PatientLabel,
} from '../../styled';

const TaskItemPatient = ({
  highlightedValue,
  taskStatus,
  isSubtask,
  hasParentTaskLabel,
  matchPatientMRN,
  patient,
  matchPatient,
  task,
  openPatientPopover,
  onTaskUpdate,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const onPatientClick = useCallback(() => {
    if (openPatientPopover && typeof openPatientPopover === 'function') {
      openPatientPopover();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient, task]);

  const handleUpdateRegularTaskPatient = useCallback(
    (patientIdentifier, patientToSave) => {
      onTaskUpdate(task?.identifier, {
        patient: patientToSave,
        patientIdentifier,
      });
    },
    [onTaskUpdate, task],
  );

  const patientName = patient?.middleName
    ? `${patient?.lastName}, ${patient?.firstName} ${patient?.middleName?.slice(
        0,
        1,
      )}`
    : `${patient?.lastName}, ${patient?.firstName}`;

  const hasSubtasks = task?.subtaskCount !== 0;
  return (
    <StandardTaskItemCell width="164px">
      <ClickablePatient onClick={onPatientClick}>
        {taskStatus !== 'COMPLETE' &&
          !patient &&
          !isSubtask &&
          !openPatientPopover && (
            <PatientDropdown
              selectedPatientIdentifier={
                patient ? patient.patientIdentifier : null
              }
              isPopoverOpen={isPopoverOpen}
              onChangePatient={handleUpdateRegularTaskPatient}
              openPopover={() => setPopoverOpen(true)}
              closePopover={() => setPopoverOpen(false)}
              isSubtask={isSubtask}
              hasSubtasks={hasSubtasks}
            >
              <AddPlaceholder>+ Add Patient</AddPlaceholder>
            </PatientDropdown>
          )}
        {taskStatus !== 'COMPLETE' &&
          !patient &&
          !isSubtask &&
          openPatientPopover && <AddPlaceholder>+ Add Patient</AddPlaceholder>}
        {patient && (openPatientPopover || hasParentTaskLabel) && (
          <PatientCard patientIdentifier={patient.patientIdentifier}>
            <PatientLabel>
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
            </PatientLabel>
          </PatientCard>
        )}
        {patient && !isSubtask && !openPatientPopover && (
          <PatientDropdown
            selectedPatientIdentifier={
              patient ? patient.patientIdentifier : null
            }
            isPopoverOpen={isPopoverOpen}
            onChangePatient={handleUpdateRegularTaskPatient}
            openPopover={() => setPopoverOpen(true)}
            closePopover={() => setPopoverOpen(false)}
            isSubtask={isSubtask}
            hasSubtasks={hasSubtasks}
          >
            <PatientCard patientIdentifier={patient.patientIdentifier}>
              <PatientLabel>
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
              </PatientLabel>
            </PatientCard>
          </PatientDropdown>
        )}
      </ClickablePatient>
    </StandardTaskItemCell>
  );
};

export default TaskItemPatient;
