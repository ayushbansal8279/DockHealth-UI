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

import { userProfileSelector } from 'selectors/user-selectors';
import { organizationSelector } from 'selectors/organization-selectors';
import PatientSelectItem from '../PatientSelectItem/PatientSelectItem';

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
  const currentUser = useSelector(userProfileSelector);
  const { emrIntegrationType } = useSelector(organizationSelector) || {};
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

  const { emrIntegrationEnabled } = currentOrganization || {};
  const quickAddPatientEnabledItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'patient.add.enabled',
    ) || {};
  const patientAddEnabled =
    !emrIntegrationEnabled ||
    (emrIntegrationEnabled && quickAddPatientEnabledItem?.value === 'true');

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
    (value) =>
      getPatientsByCriteria(value).then((fetchedPatients) => {
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchPatientsWithDebounce = useCallback(
    debounce((value) => {
      fetchPatients(value).then(() => {
        setIsLoadingPatients(false);
      });
    }, 750),
    [],
  );

  const onPatientInputChange = useCallback(
    (event) => {
      const value = event?.target?.value;
      if (value === '') {
        fetchPatientsWithDebounce.cancel();
        setSearchValue('');
        setIsLoadingPatients(false);
        setPatients([]);
      } else {
        setIsLoadingPatients(true);
        setSearchValue(value);
        fetchPatientsWithDebounce(value);
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

    if (!patientAddEnabled) {
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
    patientAddEnabled,
    // fetchPatients,
    onSelect,
  ]);

  // eslint-disable-next-line unicorn/consistent-function-scoping
  // eslint-disable-next-line sonarjs/cognitive-complexity
  const handleInputKeyDown = (event) => {
    switch (event.keyCode) {
      // esc key
      case 27: {
        event.preventDefault();
        event.stopPropagation();
        clearInput();
        break;
      }

      // enter key
      case 13: {
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
      }

      // down arrow key
      case 40: {
        event.preventDefault();
        event.stopPropagation();

        if (patients?.length > 0) {
          setHoveredItemIndex((previousIndex) => {
            return previousIndex === patients.length - 1
              ? 0
              : previousIndex + 1;
          });
        }
        break;
      }

      // up arrow key
      case 38: {
        event.preventDefault();
        event.stopPropagation();

        if (patients?.length > 0) {
          setHoveredItemIndex((previousIndex) => {
            return previousIndex === 0
              ? patients.length - 1
              : previousIndex - 1;
          });
        }
        break;
      }

      default: {
        // do nothing
        break;
      }
    }
  };

  const renderRow = (option, index) => {
    return option.unassignOption ? (
      <UnassignRowContainer
        key={option.key}
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
        key={option.key}
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
          placeholder={
            emrIntegrationType === 'FHIR'
              ? `Search ${customerTypeLabel} (MRN #)`
              : `Search ${customerTypeLabel} (first last or last, first)`
          }
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
        <ListContainer withBorder={patients.length > 0}>
          {!isLoadingPatients && patients.length >= MAX_PATIENT_RESULTS && (
            <RefineSearchRow>
              Only displaying limited number of patient profiles. Please further
              refine search!
            </RefineSearchRow>
          )}
          <Row key="header-label" readOnly>
            <PatientSelectItem
              patient={{ name: 'Name', dob: 'Dob', mrn: 'Mrn' }}
            />
          </Row>
          {!isLoadingPatients &&
            patients?.length !== 0 &&
            patients.map(renderRow)}
        </ListContainer>
      )}
    </>
  );
};
export default PatientList;
