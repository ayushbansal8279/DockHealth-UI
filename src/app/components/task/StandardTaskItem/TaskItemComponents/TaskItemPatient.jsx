import React, { useCallback, useState } from 'react';
import PatientCard from 'components/patients/PatientCard/PatientCard';
import PatientDropdown from 'components/patients/PatientDropdown/PatientDropdown';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { checkIfTemplateTask } from 'helpers/task-helpers';
import { Box } from '@mui/material';
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
  PlaceholderText,
  PatientWrapper,
  PatientContainer,
  PatientLableContainer,
  AISummaryWrapper,
  AISummaryWrapperSubtask,
} from '../../styled';
import { useDispatch, useSelector } from 'react-redux';
import AISummaryModalOpenerHelper from '@/app/modal/components/AISummaryModal/AISummaryModalOpenerHelper';
import { SummaryType } from '@/app/helpers/ai-helper';
import { userHasAiSummaryViewFeatureSelector } from '@/app/selectors/user-selectors';

const TaskItemPatient = ({
  highlightedValue,
  taskStatus,
  isSubtask,
  hasParentTaskLabel,
  matchPatientMRN,
  patient,
  matchPatient,
  task,
  taskWorkflow,
  openPatientPopover,
  onTaskUpdate,
  currentUser,
  readOnly,
  origin,
  width,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { pathname } = useLocation();
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const isCompleted = taskStatus === 'COMPLETE';
  const isTemplateTask = checkIfTemplateTask(task);
  const aiSummaryAvailable = useSelector(userHasAiSummaryViewFeatureSelector);
  const onPatientClick = useCallback(() => {
    if (openPatientPopover && typeof openPatientPopover === 'function') {
      openPatientPopover();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient, task]);
  const dispatch = useDispatch();

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

  const openPopoverWhenNotCompleted = (open) =>
    isCompleted ? () => {} : setPopoverOpen(open);

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
  const properOnPatientClick = isCompleted ? () => {} : onPatientClick;

  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customerTypeLabelCapitalized = capitalize(customerTypeLabel);
  return (
    <PatientContainer>
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
              taskWorkflow={taskWorkflow}
              hasSubtasks={hasSubtasks}
              origin={origin}
              openAddPatientModal
            >
              <PatientWrapper>
                <PlaceholderText>
                  + Add {customerTypeLabelCapitalized}
                </PlaceholderText>
              </PatientWrapper>
            </PatientDropdown>
          )}
        {!readOnly &&
          !isCompleted &&
          !patient &&
          !isSubtask &&
          openPatientPopover && (
            <AddPlaceholder>
              + Add {customerTypeLabelCapitalized}
            </AddPlaceholder>
          )}
        {patient && (openPatientPopover || hasParentTaskLabel) && (
          <PatientCard
            disableLink={readOnly}
            patientIdentifier={patient.patientIdentifier}
          >
            <PatientLableContainer>
              {aiSummaryAvailable && (
                <AISummaryWrapperSubtask>
                  <AISummaryModalOpenerHelper
                    type={SummaryType.PATIENT}
                    title={`${patient?.lastName}, ${patient?.firstName}`}
                    identifier={patient.patientIdentifier}
                    subtleDisplay
                  />
                </AISummaryWrapperSubtask>
              )}

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
            </PatientLableContainer>
            <PatientPrintAdditionalInfo>
              {patient.mrn && <Box whiteSpace="normal">MRN: {patient.mrn}</Box>}
              {patient.dob && <Box whiteSpace="normal">DoB: {patient.dob}</Box>}
            </PatientPrintAdditionalInfo>
          </PatientCard>
        )}
        {patient && !openPatientPopover && !hasParentTaskLabel && (
          <PatientCard
            disableLink={readOnly}
            patientIdentifier={patient.patientIdentifier}
          >
            <PatientLableContainer>
              {aiSummaryAvailable && (
                <AISummaryWrapper>
                  <AISummaryModalOpenerHelper
                    type={SummaryType.PATIENT}
                    title={`${patient?.lastName}, ${patient?.firstName}`}
                    identifier={patient.patientIdentifier}
                    subtleDisplay
                  />
                </AISummaryWrapper>
              )}
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
                    <div
                      style={{
                        width: width ? `${width - 50}px` : '180px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >{`${patientName}`}</div>
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
            </PatientLableContainer>
          </PatientCard>
        )}
      </ClickablePatient>
    </PatientContainer>
  );
};

export default TaskItemPatient;
