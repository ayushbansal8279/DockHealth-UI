import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import MagnifierIcon from 'img/magnifier.svg';
import { getPatientsByCriteria } from 'api/patients-api';
import { addPatient } from 'api/patient-api';
import { getFormattedPatients } from 'components/task-drawer/PatientSection/helpers';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { onTaskDrawerPatientAdded } from 'helpers/ga-event-helper';
import { noop } from 'helpers/utility-functions';
import AddRecordOption from 'components/common/AddRecordOption/AddRecordOption';
import { List } from 'react-virtualized';

import {
  Input,
  InputBox,
  ListContainer,
  Row,
  LoaderItem,
  LoaderContainer,
  UnassignRowContainer,
  UnassignRow,
  RefineSearchRow,
} from './styled';

const MAX_PATIENT_RESULTS = 200;

const PatientList = ({
  selectedPatientIdentifier,
  patientIdentifiersToExclude = [],
  disableAdding,
  onSelect,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [patients, setPatients] = useState([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const inputReference = useRef(null);
  const [hoveredItemIndex, setHoveredItemIndex] = useState(0);
  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
  }));
  const currentOrganizationIdentifier = sessionStorage.getItem(
    'currentOrganizationIdentifier',
  );
  const currentOrganization =
    currentUser?.userOrganizations?.find(
      ({ organizationIdentifier }) =>
        organizationIdentifier === currentOrganizationIdentifier,
    ) || {};
  const customerTypeLabel = getCustomerTypeLabel(currentUser);

  const displayUnassignedOption = useMemo(
    () =>
      'unassigned'.includes(searchValue.toLowerCase()) &&
      selectedPatientIdentifier,
    [searchValue, selectedPatientIdentifier],
  );

  useEffect(() => {
    if (patients.length === 0 && displayUnassignedOption) {
      setPatients([{ unassignOption: true, patientIdentifier: 'UNASSIGNED' }]);
    }
  }, [displayUnassignedOption, patients.length]);

  useEffect(() => {
    if (inputReference) {
      // eslint-disable-next-line no-unused-expressions
      inputReference?.current?.focus();
    }
  }, [inputReference]);

  const fetchPatients = useCallback(
    value =>
      getPatientsByCriteria(value).then(fetchedPatients => {
        const p = fetchedPatients.filter(
          ({ patientIdentifier }) =>
            !patientIdentifiersToExclude.includes(patientIdentifier),
        );
        if (
          'unassigned'.includes(value.toLowerCase()) &&
          selectedPatientIdentifier
        ) {
          setPatients([
            { unassignOption: true, patientIdentifier: 'UNASSIGNED' },
            ...getFormattedPatients({ patients: p }),
          ]);
        } else {
          setPatients(getFormattedPatients({ patients: p }));
        }
      }),
    [patientIdentifiersToExclude, selectedPatientIdentifier],
  );

  const fetchPatientsWithDebounce = useCallback(
    debounce(value => {
      fetchPatients(value).then(() => {
        setIsLoadingPatients(false);
      });
    }, 750),
    [],
  );

  const onPatientInputChange = useCallback(
    event => {
      const value = event?.target?.value;
      if (value !== '') {
        setIsLoadingPatients(true);
        setSearchValue(value);
        fetchPatientsWithDebounce(value);
      } else {
        fetchPatientsWithDebounce.cancel();
        setSearchValue('');
        setIsLoadingPatients(false);
        setPatients([]);
      }
    },
    [fetchPatientsWithDebounce],
  );

  const clearInput = () => {
    setSearchValue('');
    setPatients([]);
    inputReference.current.focus();
  };

  const handleAddPatient = useCallback(() => {
    const patient = searchValue;

    if (currentOrganization.emrIntegrationEnabled) {
      return;
    }

    let data = {};
    if (patient.includes(',')) {
      const [lastName, ...firstNames] = patient.split(',');
      data = { lastName, firstName: firstNames.join(' ').trim() };
    } else {
      const [firstName, ...lastNames] = patient.split(' ');
      data = { firstName, lastName: lastNames.join(' ') };
    }

    onTaskDrawerPatientAdded();

    addPatient(data)
      .then(async ({ patientIdentifier, firstName, lastName }) => {
        clearInput();
        await onSelect({
          firstName,
          lastName,
          value: patientIdentifier,
          patientIdentifier,
          displayLabel: `${lastName}, ${firstName} `,
        });
      })
      .catch(noop);
  }, [
    searchValue,
    currentOrganization.emrIntegrationEnabled,
    // fetchPatients,
    onSelect,
  ]);

  // eslint-disable-next-line unicorn/consistent-function-scoping
  // eslint-disable-next-line sonarjs/cognitive-complexity
  const handleInputKeyDown = event => {
    switch (event.keyCode) {
      // esc key
      case 27:
        event.preventDefault();
        event.stopPropagation();
        clearInput();
        break;

      // enter key
      case 13:
        event.preventDefault();
        event.stopPropagation();

        if (
          (searchValue && patients?.length > 0 && patients[hoveredItemIndex]) ||
          displayUnassignedOption
        ) {
          onSelect(patients[hoveredItemIndex].patient);
          clearInput();
        }
        break;

      // down arrow key
      case 40:
        event.preventDefault();
        event.stopPropagation();

        if (patients?.length > 0) {
          setHoveredItemIndex(previousIndex => {
            let newIndex;
            if (previousIndex === patients.length - 1) {
              newIndex = 0;
            } else {
              newIndex = previousIndex + 1;
            }

            return newIndex;
          });
        }
        break;

      // up arrow key
      case 38:
        event.preventDefault();
        event.stopPropagation();

        if (patients?.length > 0) {
          setHoveredItemIndex(previousIndex => {
            let newIndex;

            if (previousIndex === 0) {
              newIndex = patients.length - 1;
            } else {
              newIndex = previousIndex - 1;
            }

            return newIndex;
          });
        }
        break;

      default:
        // do nothing
        break;
    }
  };

  const renderRow = ({ index, key, style }) => {
    const option = patients[index];
    return option.unassignOption ? (
      <UnassignRowContainer
        key={key}
        style={style}
        withBorder={displayUnassignedOption}
      >
        <UnassignRow
          key="UNASSIGNED"
          type="button"
          onClick={() => {
            clearInput();
            onSelect(null);
          }}
          isHovered={hoveredItemIndex === index}
        >
          Unassign
        </UnassignRow>
      </UnassignRowContainer>
    ) : (
      <Row
        key={key}
        style={style}
        type="button"
        isHovered={hoveredItemIndex === index}
        onClick={() => {
          clearInput();
          onSelect(option.patient);
        }}
      >
        {option.label({ searchValue })}
      </Row>
    );
  };

  return (
    <>
      <InputBox>
        <img src={MagnifierIcon} alt="magnifier" />
        <Input
          ref={inputReference}
          placeholder={`Search ${customerTypeLabel} (first last or last, first)`}
          value={searchValue}
          onChange={onPatientInputChange}
          onKeyDown={handleInputKeyDown}
        />
      </InputBox>
      {isLoadingPatients && (
        <LoaderContainer>
          <LoaderItem />
          <LoaderItem />
          <LoaderItem />
        </LoaderContainer>
      )}
      {!disableAdding &&
        !isLoadingPatients &&
        patients.length === 0 &&
        searchValue !== '' && (
          <AddRecordOption
            showAddOption={!currentOrganization?.emrIntegrationEnabled}
            customerTypeLabel={customerTypeLabel}
            onClick={handleAddPatient}
            searchValue={searchValue}
          />
        )}
      {!isLoadingPatients && (
        <ListContainer withBorder={patients.length !== 0}>
          {!isLoadingPatients && patients.length >= MAX_PATIENT_RESULTS && (
            <RefineSearchRow>
              Please further refine search, too many results!
            </RefineSearchRow>
          )}
          {!isLoadingPatients && patients?.length !== 0 && (
            <List
              scrollToIndex={hoveredItemIndex}
              width={600}
              height={patients.length > 6 ? 248 : patients.length * 40}
              rowHeight={40}
              rowRenderer={renderRow}
              rowCount={patients.length}
            />
          )}
        </ListContainer>
      )}
    </>
  );
};

export default PatientList;
