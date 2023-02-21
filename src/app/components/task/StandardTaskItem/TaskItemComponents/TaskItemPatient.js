import React, { useCallback, useState } from 'react';
import PatientCard from 'components/patients/PatientCard/PatientCard';
import PatientDropdown from 'components/patients/PatientDropdown/PatientDropdown';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { checkIfTemplateTask } from 'helpers/task-helpers';
import { Box } from '@material-ui/core';
import { capitalize } from 'helpers/capitalize';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Highlighter from 'react-highlight-words';

import {
  AddPlaceholder,
  ClickablePatient,
  PatientLabel,
  DisabledLink,
  DisabledPatientLabel,
  PatientPrintAdditionalInfo,
} from '../../styled';

const TaskItemPatient = ({
  highlightedValue,
  taskStatus,
  isSubtask,
  // hasParentTaskLabel,
  matchPatientMRN,
  patient,
  matchPatient,
  task,
  openPatientPopover,
  onTaskUpdate,
  currentUser,
  readOnly,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { pathname } = useLocation();
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const isCompleted = taskStatus === 'COMPLETE';
  const isTemplateTask = checkIfTemplateTask(task);
  const onPatientClick = useCallback(() => {
    if (openPatientPopover && typeof openPatientPopover === 'function') {
      openPatientPopover();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient, task]);

  const Link = readOnly ? DisabledLink : RouterLink;

  const handleUpdateRegularTaskPatient = useCallback(
    (patientIdentifier, patientToSave) => {
      onTaskUpdate(task?.identifier, {
        patient: patientToSave,
        patientIdentifier,
      });
    },
    [onTaskUpdate, task],
  );

  const openPopoverWhenNotCompleted = open =>
    !isCompleted ? setPopoverOpen(open) : () => {};

  const patientName = patient?.middleName
    ? `${patient?.lastName}, ${patient?.firstName} ${patient?.middleName?.slice(
        0,
        1,
      )}`
    : `${patient?.lastName}, ${patient?.firstName}`;

  const hasSubtasks = task?.subTasksCount > 0;
  const PatientLabelComponent = isCompleted
    ? DisabledPatientLabel
    : PatientLabel;
  const properOnPatientClick = !isCompleted ? onPatientClick : () => {};

  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customerTypeLabelCapitalized = capitalize(customerTypeLabel);
  return (
    <ClickablePatient onClick={properOnPatientClick}>
      {!readOnly &&
        !isCompleted &&
        !patient &&
        !isSubtask &&
        !openPatientPopover &&
        !isTemplateTask && (
          <PatientDropdown
            selectedPatientIdentifier={
              patient ? patient.patientIdentifier : null
            }
            isPopoverOpen={isPopoverOpen}
            onChangePatient={handleUpdateRegularTaskPatient}
            openPopover={() => openPopoverWhenNotCompleted(true)}
            closePopover={() => setPopoverOpen(false)}
            isSubtask={isSubtask}
            hasSubtasks={hasSubtasks}
          >
            <AddPlaceholder>
              + Add {customerTypeLabelCapitalized}
            </AddPlaceholder>
          </PatientDropdown>
        )}
      {!readOnly &&
        !isCompleted &&
        !patient &&
        !isSubtask &&
        openPatientPopover && (
          <AddPlaceholder>+ Add {customerTypeLabelCapitalized}</AddPlaceholder>
        )}
      {patient && openPatientPopover && (
        <PatientCard
          disableLink={readOnly}
          patientIdentifier={patient.patientIdentifier}
        >
          <Link
            to={{
              pathname: `/core/patient/${patient.patientIdentifier}`,
              state: {
                from: pathname,
              },
            }}
          >
            <PatientLabelComponent>
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
            </PatientLabelComponent>
          </Link>
          <PatientPrintAdditionalInfo>
            {patient.mrn && <Box whiteSpace="normal">MRN: {patient.mrn}</Box>}
            {patient.dob && <Box whiteSpace="normal">DoB: {patient.dob}</Box>}
          </PatientPrintAdditionalInfo>
        </PatientCard>
      )}
      {patient && !openPatientPopover && (
        <PatientCard
          disableLink={readOnly}
          patientIdentifier={patient.patientIdentifier}
        >
          <Link
            to={{
              pathname: `/core/patient/${patient.patientIdentifier}`,
              state: {
                from: pathname,
              },
            }}
          >
            <PatientLabelComponent>
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
              <PatientPrintAdditionalInfo>
                {patient.mrn && (
                  <Box whiteSpace="normal">MRN: {patient.mrn}</Box>
                )}
                {patient.dob && (
                  <Box whiteSpace="normal">DoB: {patient.dob}</Box>
                )}
              </PatientPrintAdditionalInfo>
            </PatientLabelComponent>
          </Link>
        </PatientCard>
      )}
    </ClickablePatient>
  );
};

export default TaskItemPatient;
