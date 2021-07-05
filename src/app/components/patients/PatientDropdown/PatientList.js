import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import { isOutsideScrollView } from 'helpers/scroll-helper';
import MagnifierIcon from 'img/magnifier.svg';
import { getPatientsByCriteria } from 'api/patient-api';
import { getFormattedPatients } from 'components/task-drawer/PatientSection/helpers';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import {
  Input,
  InputBox,
  ListContainer,
  Row,
  LoaderItem,
  LoaderContainer,
  NoPatientFound,
  UnassignRowContainer,
  UnassignRow,
} from './styled';

const PatientList = ({
  onSelect,
  selectedPatientIdentifier,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [patients, setPatients] = useState([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const listReference = useRef(null);
  const inputReference = useRef(null);
  const [hoveredItemIndex, setHoveredItemIndex] = useState(0);

  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
  }));
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
        if (
          'unassigned'.includes(value.toLowerCase()) &&
          selectedPatientIdentifier
        ) {
          setPatients([
            { unassignOption: true, patientIdentifier: 'UNASSIGNED' },
            ...getFormattedPatients({ patients: fetchedPatients }),
          ]);
        } else {
          setPatients(getFormattedPatients({ patients: fetchedPatients }));
        }
      }),
    [selectedPatientIdentifier],
  );

  const fetchPatientsWithDebounce = useCallback(
    debounce(value => {
      fetchPatients(value).then(() => {
        setIsLoadingPatients(false);
      });
    }, 500),
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

            if (listReference.current?.children?.[newIndex])
              listReference.current.children[newIndex].scrollIntoView(false);

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

            if (
              listReference.current?.children?.[newIndex] &&
              isOutsideScrollView(
                listReference.current,
                listReference.current?.children?.[newIndex],
              )
            ) {
              listReference.current.scrollTop =
                listReference.current?.children?.[newIndex].offsetTop;
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

  return (
    <>
      <InputBox>
        <img src={MagnifierIcon} alt="magnifier" />
        <Input
          ref={inputReference}
          placeholder={`Search ${customerTypeLabel}`}
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
      {!isLoadingPatients && patients.length === 0 && searchValue !== '' && (
        <NoPatientFound>No {customerTypeLabel} found</NoPatientFound>
      )}
      {!isLoadingPatients && (
        <ListContainer withBorder={patients.length !== 0} ref={listReference}>
          {!isLoadingPatients &&
            patients.length !== 0 &&
            patients?.map((option, index) =>
              option.unassignOption ? (
                <UnassignRowContainer withBorder={displayUnassignedOption}>
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
                  key={option.patient.patientIdentifier}
                  type="button"
                  isHovered={hoveredItemIndex === index}
                  onClick={() => {
                    clearInput();
                    onSelect(option.patient);
                  }}
                >
                  {option.label({ searchValue })}
                </Row>
              ),
            )}
        </ListContainer>
      )}
    </>
  );
};

export default PatientList;
