/* eslint-disable sonarjs/cognitive-complexity */
import moment from 'moment';
import React, { useState } from 'react';
import { Link } from 'react-router';

import PatientImportPopover from '../PatientImportPopover/PatientImportPopover';
import PatientListLoader from '../PatientsListLoader/PatientListLoader';
import EmptyPatientsList from '../EmptyPatientsList/EmptyPatientsList';
import EmptyFilteredPatientsList from '../EmptyFilteredPatientsList/EmptyFilteredPatientsList';
import { ListHeader, ListRow, NonEmptyListTable } from './styled';

const capitalize = text =>
  typeof text === 'string'
    ? text.charAt(0).toUpperCase() + text.slice(1)
    : text;

const formatDateOfBirth = dob => dob && moment(dob).format('MMM D, YYYY');

const PatientsList = ({
  patients,
  isFiltered,
  isCompact,
  highlightedPatientIdentifier,
  patientImportDetails,
  refreshPatientList,
  importPopoverOpen,
  setImportPopoverOpen,
  hasImportErrors,
  isGuest,
  isFetching,
  onAddPatientClick,
  emrIntegrationEnabled,
}) => {
  const [importPopupOpen, setImportPopupOpen] = useState(false);

  return (
    <>
      {isFetching ? (
        <PatientListLoader />
      ) : (
        <>
          {patients?.length > 0 ? (
            <NonEmptyListTable
              listLength={patients?.length ?? 0}
              highlightedPatientIdentifier={highlightedPatientIdentifier}
            >
              <ListHeader isCompact={isCompact}>
                <div>Name</div>
                <div>MRN</div>
                {!isCompact && (
                  <>
                    <div>DOB</div>
                    <div>Age</div>
                    <div>Gender</div>
                  </>
                )}
              </ListHeader>
              {patients.map(
                ({
                  patientIdentifier,
                  mrn,
                  lastName,
                  firstName,
                  middleName,
                  dob,
                  age,
                  gender,
                }) => (
                  <Link
                    key={patientIdentifier}
                    to={`/patient/${patientIdentifier}`}
                  >
                    <ListRow
                      isHighlighted={
                        patientIdentifier === highlightedPatientIdentifier
                      }
                      isCompact={isCompact}
                    >
                      <div>
                        {`${capitalize(lastName) || '—'}, ${capitalize(
                          firstName,
                        ) || '—'} ${capitalize(middleName) || ''}`}
                      </div>
                      <div>{mrn}</div>
                      {!isCompact && (
                        <>
                          <div>{formatDateOfBirth(dob)}</div>
                          <div>{age}</div>
                          <div>{capitalize(gender)}</div>
                        </>
                      )}
                    </ListRow>
                  </Link>
                ),
              )}
            </NonEmptyListTable>
          ) : (
            <>
              {isFiltered || isGuest || emrIntegrationEnabled ? (
                <EmptyFilteredPatientsList />
              ) : (
                <>
                  <EmptyPatientsList
                    onAddPatientClick={onAddPatientClick}
                    importPopupOpen={importPopupOpen}
                    setImportPopupOpen={setImportPopupOpen}
                    setImportPopoverOpen={setImportPopoverOpen}
                    refreshPatientList={refreshPatientList}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
      {importPopoverOpen && (
        <PatientImportPopover
          closePopover={() => {
            setImportPopoverOpen(false);
          }}
          patientImportDetails={patientImportDetails}
          hasImportErrors={hasImportErrors}
        />
      )}
    </>
  );
};

export default PatientsList;
