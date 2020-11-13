/* eslint-disable sonarjs/cognitive-complexity */
import moment from 'moment';
import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router';
import Spacing from 'components/common/Spacing';

import SortArrow, {
  SORT_ORDER_TYPES,
} from 'components/common/SortArrow/SortArrow';
import PatientImportPopover from '../PatientImportPopover/PatientImportPopover';
import PatientListLoader from '../PatientsListLoader/PatientListLoader';
import EmptyPatientsList from '../EmptyPatientsList/EmptyPatientsList';
import EmptyFilteredPatientsList from '../EmptyFilteredPatientsList/EmptyFilteredPatientsList';
import { ListHeader, ListRow, NonEmptyListTable } from './styled';

const SORTING_METHODS = {
  lastName: (a, b) =>
    a.lastName.trim().localeCompare(b.lastName.trim()) ||
    a.firstName.trim().localeCompare(b.firstName.trim()),
  mrn: (a, b) => {
    if (!a.mrn?.trim()) return 1;

    if (!b.mrn?.trim()) return -1;

    return a.mrn.localeCompare(b.mrn);
  },
  dob: (a, b) => {
    if (!a?.dob) return 1;

    if (!b?.dob) return -1;

    return b?.dob > a?.dob ? -1 : 1;
  },
  age: (a, b) => {
    if (!a?.dob) return 1;

    if (!b?.dob) return -1;

    return b?.dob > a?.dob ? 1 : -1;
  },
  gender: (a, b) => {
    if (!a.gender?.trim()) return 1;

    if (!b.gender?.trim()) return -1;

    return a.gender.localeCompare(b.gender);
  },
};

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
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [hoveredHeader, setHoveredHeader] = useState(null);

  const sortedPatients = useMemo(() => {
    if (!patients?.length > 0) {
      return patients;
    }

    if (!sortKey) {
      return patients;
    }

    return patients.slice().sort(SORTING_METHODS[sortKey]);
  }, [sortKey, patients]);

  const sortedPatientsWithOrderType = useMemo(() => {
    if (sortOrder && sortOrder === SORT_ORDER_TYPES.desc) {
      const foundIndex = sortedPatients.findIndex(patient => !patient[sortKey]);

      if (foundIndex === -1) {
        return sortedPatients.slice().reverse();
      }

      const partWithValues = sortedPatients.slice(0, foundIndex);
      const partWithoutValues = sortedPatients.slice(foundIndex);

      return partWithValues.reverse().concat(partWithoutValues);
    }

    return sortedPatients;
  }, [sortedPatients, sortOrder, sortKey]);

  const handleSortChange = useCallback(
    key => {
      if (key === sortKey) {
        switch (sortOrder) {
          case SORT_ORDER_TYPES.default:
            setSortOrder(SORT_ORDER_TYPES.asc);
            break;
          case SORT_ORDER_TYPES.asc:
            setSortOrder(SORT_ORDER_TYPES.desc);
            break;
          case SORT_ORDER_TYPES.desc:
            setSortOrder(SORT_ORDER_TYPES.default);
            setSortKey(null);
            break;
          default:
            setSortKey(null);
            setSortOrder(SORT_ORDER_TYPES.default);
            break;
        }
      } else {
        setSortKey(key);
        setSortOrder(SORT_ORDER_TYPES.asc);
      }
    },
    [sortKey, sortOrder],
  );

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
                <div
                  onMouseEnter={() => setHoveredHeader('lastName')}
                  onMouseLeave={() => setHoveredHeader(null)}
                >
                  Name
                  <Spacing horizontal={3} />
                  <SortArrow
                    orderType={sortKey === 'lastName' && sortOrder}
                    onClick={() => handleSortChange('lastName')}
                    isParentHovered={hoveredHeader === 'lastName'}
                  />
                </div>
                <div
                  onMouseEnter={() => setHoveredHeader('mrn')}
                  onMouseLeave={() => setHoveredHeader(null)}
                >
                  MRN
                  <Spacing horizontal={3} />
                  <SortArrow
                    orderType={sortKey === 'mrn' && sortOrder}
                    onClick={() => handleSortChange('mrn')}
                    isParentHovered={hoveredHeader === 'mrn'}
                  />
                </div>
                {!isCompact && (
                  <>
                    <div
                      onMouseEnter={() => setHoveredHeader('dob')}
                      onMouseLeave={() => setHoveredHeader(null)}
                    >
                      DOB
                      <Spacing horizontal={3} />
                      <SortArrow
                        orderType={sortKey === 'dob' && sortOrder}
                        onClick={() => handleSortChange('dob')}
                        isParentHovered={hoveredHeader === 'dob'}
                      />
                    </div>
                    <div
                      onMouseEnter={() => setHoveredHeader('age')}
                      onMouseLeave={() => setHoveredHeader(null)}
                    >
                      Age
                      <Spacing horizontal={3} />
                      <SortArrow
                        orderType={sortKey === 'age' && sortOrder}
                        onClick={() => handleSortChange('age')}
                        isParentHovered={hoveredHeader === 'age'}
                      />
                    </div>
                    <div
                      onMouseEnter={() => setHoveredHeader('gender')}
                      onMouseLeave={() => setHoveredHeader(null)}
                    >
                      <Spacing horizontal={3} />
                      Gender
                      <Spacing horizontal={3} />
                      <SortArrow
                        orderType={sortKey === 'gender' && sortOrder}
                        onClick={() => handleSortChange('gender')}
                        isParentHovered={hoveredHeader === 'gender'}
                      />
                    </div>
                  </>
                )}
              </ListHeader>
              {sortedPatientsWithOrderType.map(
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
