import React, { useCallback, useState } from 'react';
import PatientCard from 'components/patients/PatientCard/PatientCard';
import PatientDropdown from 'components/patients/PatientDropdown/PatientDropdown';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
import { Link as RouterLink } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import {
  AddPlaceholder,
  ClickablePatient,
  PatientLabel,
  DisabledLink,
} from './styled';

const TaskTemplatePatient = ({
  highlightedValue,
  workflow,
  openPatientPopover,
  onWorkflowUpdate,
  currentUser,
  readOnly,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const matchPatientMRN = workflow?.searchMetaData?.matchPatientMRN;
  const matchPatient = workflow?.searchMetaData?.matchPatient;
  const { patient } = workflow;

  const Link = readOnly ? DisabledLink : RouterLink;

  const handleUpdateRegularTaskPatient = useCallback(
    (patientIdentifier, patientToSave) => {
      onWorkflowUpdate(workflow?.identifier, {
        patient: patientToSave,
        patientIdentifier,
      });
    },
    [onWorkflowUpdate, workflow],
  );

  const patientName = patient?.middleName
    ? `${patient?.lastName}, ${patient?.firstName} ${patient?.middleName?.slice(
        0,
        1,
      )}`
    : `${patient?.lastName}, ${patient?.firstName}`;

  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customerTypeLabelCapitalized = capitalize(customerTypeLabel);

  return (
    <ClickablePatient>
      {!readOnly && !patient && !openPatientPopover && (
        <PatientDropdown
          selectedPatientIdentifier={patient ? patient.patientIdentifier : null}
          isPopoverOpen={isPopoverOpen}
          onChangePatient={handleUpdateRegularTaskPatient}
          openPopover={() => setPopoverOpen(true)}
          closePopover={() => setPopoverOpen(false)}
        >
          <AddPlaceholder>+ Add {customerTypeLabelCapitalized}</AddPlaceholder>
        </PatientDropdown>
      )}
      {!readOnly && !patient && openPatientPopover && (
        <AddPlaceholder>+ Add {customerTypeLabelCapitalized}</AddPlaceholder>
      )}
      {patient && openPatientPopover && (
        <PatientCard
          disableLink={readOnly}
          patientIdentifier={patient.patientIdentifier}
        >
          <Link to={`/core/patient/${patient.patientIdentifier}`}>
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
          </Link>
        </PatientCard>
      )}
      {patient && !openPatientPopover && (
        <PatientCard
          disableLink={readOnly}
          patientIdentifier={patient.patientIdentifier}
        >
          <Link to={`/core/patient/${patient.patientIdentifier}`}>
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
          </Link>
        </PatientCard>
      )}
    </ClickablePatient>
  );
};

export default TaskTemplatePatient;
