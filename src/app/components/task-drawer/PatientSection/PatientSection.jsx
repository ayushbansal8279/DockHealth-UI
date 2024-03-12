import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import { organizationSelector } from 'selectors/organization-selectors';
import {
  onTaskDrawerPatientAdded,
  onTaskDrawerTaskPatientChanged,
} from 'helpers/ga-event-helper';
import * as AlertActions from 'alert/actions';
import debounce from 'lodash.debounce';
import PatientSelectItem from 'components/patients/PatientSelectItem/PatientSelectItem';
import { openModal } from 'modal/actions';
import { getPatientsByCriteria } from 'api/patients-api';
import { addPatient } from 'api/patient-api';
import { changePatientForTemplateBundle } from 'actions/template-bundle-actions';
import { noop } from 'helpers/utility-functions';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import AssignMemberIcon from 'components/user/AssignMemberIcon/AssingMemberIcon';
import { useHistory, useLocation } from 'react-router-dom';
import SelectDropdown from '../SelectDropdown/SelectDropdown';
import { getFormattedPatient, getFormattedPatients } from './helpers';
import {
  PatientMainContainer,
  PatientContainer,
  Title,
  AddPatient,
  PatientName,
} from './styled';

const PATIENT_IDENTIFIER_FIELD_NAME = 'patientIdentifier';
const MAX_PATIENT_RESULTS = 200;

const PatientSection = ({
  selectedPatient,
  autofocus,
  disabled,
  placeholder,
  onSave,
  isSubtask,
  quickAddPatientEnabled,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const dispatch = useDispatch();
  const patientInputReference = useRef(null);
  const [patients, setPatients] = useState([]);
  const [assignedPatient, setAssignedPatient] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (selectedPatient) {
      setPatients([selectedPatient]);
      setAssignedPatient(getFormattedPatient(selectedPatient));
    } else {
      setAssignedPatient(null);
    }
  }, [selectedPatient]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const currentUser = useSelector(userProfileSelector);
  const { emrIntegrationType } = useSelector(organizationSelector) || {};
  const { templateBundleIdentifier } = useSelector(selectedTaskSelector) || {};

  const currentOrganizationIdentifier = sessionStorage.getItem(
    'currentOrganizationIdentifier',
  );
  const currentOrganization =
    currentUser?.userOrganizations?.find(
      ({ organizationIdentifier }) =>
        organizationIdentifier === currentOrganizationIdentifier,
    ) || {};

  const { emrIntegrationEnabled } = currentOrganization || {};
  const quickAddPatientEnabledItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'patient.add.enabled',
    ) || {};
  const patientAddEnabled =
    !emrIntegrationEnabled ||
    (emrIntegrationEnabled && quickAddPatientEnabledItem?.value === 'true');

  const formattedPatients = getFormattedPatients({ patients });
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  // const customerTypeLabelCapitalized = customerTypeLabel;

  useEffect(() => {
    if (patientInputReference?.current && autofocus)
      patientInputReference.current.querySelector('input').focus();
  }, [autofocus, patientInputReference]);

  const savePatient = useCallback(
    // eslint-disable-next-line sonarjs/cognitive-complexity
    async (patientToSave) => {
      try {
        const onSavePatient = async (skipModals) => {
          if (skipModals) {
            onTaskDrawerTaskPatientChanged();
            await onSave({
              patient: patientToSave,
              patientIdentifier:
                patientToSave?.patientIdentifier || 'UNASSIGNED',
            });
          } else {
            // eslint-disable-next-line no-lonely-if
            if (isSubtask) {
              if (selectedPatient && !patientToSave?.patientIdentifier) {
                dispatch(
                  openModal('UnassignPatient', {
                    confirm: async () => {
                      onTaskDrawerTaskPatientChanged();
                      await onSave({
                        patientIdentifier: 'UNASSIGNED',
                      });
                    },
                  }),
                );
              } else if (!selectedPatient && patientToSave?.patientIdentifier) {
                dispatch(
                  openModal('AssignPatient', {
                    confirm: async () => {
                      onTaskDrawerTaskPatientChanged();
                      await onSave({
                        patient: patientToSave,
                        patientIdentifier: patientToSave?.patientIdentifier,
                      });
                    },
                  }),
                );
              }
            } else {
              onSavePatient(true);
            }
          }
        };

        if (templateBundleIdentifier) {
          if (selectedPatient) {
            if (patientToSave) {
              dispatch(
                openModal('AssignPatient', {
                  isWorkflowModal: true,
                  confirm: () => {
                    dispatch(
                      changePatientForTemplateBundle(
                        templateBundleIdentifier,
                        patientToSave?.patientIdentifier,
                      ),
                    );
                    onSavePatient(true);
                  },
                  patientName: patientToSave?.lastName
                    ? `${patientToSave?.lastName}, ${patientToSave?.firstName}`
                    : patientToSave?.firstName,
                }),
              );
            } else {
              dispatch(
                openModal('UnassignPatient', {
                  isWorkflowModal: true,
                  confirm: () => {
                    dispatch(
                      changePatientForTemplateBundle(
                        templateBundleIdentifier,
                        'UNASSIGNED',
                      ),
                    );
                    onSavePatient(true);
                  },
                }),
              );
            }
          } else {
            dispatch(
              changePatientForTemplateBundle(
                templateBundleIdentifier,
                patientToSave?.patientIdentifier,
              ),
            );
            onSavePatient(true);
          }
        } else {
          onSavePatient();
        }
      } catch {
        dispatch(
          AlertActions.showGlobalAlert(
            `Error updating ${customerTypeLabel}, please try again later`,
            'error',
          ),
        );
      }
    },
    [
      dispatch,
      isSubtask,
      onSave,
      selectedPatient,
      templateBundleIdentifier,
      customerTypeLabel,
    ],
  );

  const fetchPatients = useCallback(
    (value) =>
      getPatientsByCriteria(value).then((fetchedPatients) => {
        setPatients(fetchedPatients);
        return fetchedPatients;
      }),
    [],
  );

  const fetchPatientsWithDebounce = debounce((value) => {
    fetchPatients(value).then(() => {
      setIsLoadingPatients(false);
    });
  }, 750);

  const onPatientInputChange = useCallback(
    (value) => {
      if (value === '') {
        fetchPatientsWithDebounce.cancel();
        setPatients([]);
      } else {
        setIsLoadingPatients(true);
        fetchPatientsWithDebounce(value);
      }
    },
    [fetchPatientsWithDebounce],
  );

  const handleClearSelectedPatient = useCallback(
    async (clearInput) => {
      if (templateBundleIdentifier && selectedPatient) {
        dispatch(
          openModal('UnassignPatient', {
            isWorkflowModal: true,
            confirm: async () => {
              dispatch(
                changePatientForTemplateBundle(
                  templateBundleIdentifier,
                  'UNASSIGNED',
                ),
              );
              setAssignedPatient(null);
              setPatients([]);
              await savePatient(null);
              clearInput();
              // eslint-disable-next-line no-unused-expressions
              patientInputReference.current?.querySelector('input')?.focus();
            },
          }),
        );
      } else {
        setAssignedPatient(null);

        setPatients([]);
        await savePatient(null);
      }
    },
    [dispatch, savePatient, selectedPatient, templateBundleIdentifier],
  );

  const handlePatientSelect = useCallback(
    async (selectedOption) => {
      const [lastName, names] = selectedOption.displayLabel.split(', ');
      const [firstName, middleName] = names.split(' ');
      const patient = {
        patientIdentifier: selectedOption.value,
        patientName: selectedOption.displayLabel,
        lastName,
        firstName,
        middleName: middleName || '',
      };
      setAssignedPatient(patient);
      savePatient(patient);
      // eslint-disable-next-line no-unused-expressions
      patientInputReference.current?.querySelector('input')?.blur();
    },
    [savePatient],
  );

  const handleAddPatient = useCallback(
    (patient) => {
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
          await fetchPatients(patient);
          await handlePatientSelect({
            value: patientIdentifier,
            displayLabel: `${lastName}, ${firstName} `,
          });
        })
        .catch(noop);
    },
    [patientAddEnabled, fetchPatients, handlePatientSelect],
  );

  const patientProfile = () => {
    history.push(`/core/patient/${selectedPatient.patientIdentifier}`);
  };

  return (
    <PatientMainContainer>
      <Title>Patient</Title>
      {selectedPatient && (
        <PatientContainer>
          {' '}
          <PatientName onClick={patientProfile}>
            {selectedPatient.patientName}{' '}
          </PatientName>
          <button style={{color: '#8492A4'}} onClick={handleClearSelectedPatient}>x</button>
        </PatientContainer>
      )}

      {!selectedPatient && (
        <div style={{ display: 'flex' }}>
          <SelectDropdown
            ref={patientInputReference}
            name={PATIENT_IDENTIFIER_FIELD_NAME}
            // label={customerTypeLabelCapitalized}
            // placeholder={
            //   emrIntegrationType === 'FHIR'
            //     ? `Who is the ${customerTypeLabel}? (MRN #)`
            //     : placeholder ||
            //       `Who is the ${customerTypeLabel}? (first last or last, first)`
            // }
            placeholder="Add Patient"
            disabled={disabled}
            selectedOption={assignedPatient}
            options={formattedPatients}
            headerOption={
              <PatientSelectItem
                patient={{ name: 'Name', dob: 'Dob', mrn: 'Mrn' }}
              />
            }
            isLoadingOptions={isLoadingPatients}
            onInputChange={onPatientInputChange}
            onOptionSelect={handlePatientSelect}
            onClear={handleClearSelectedPatient}
            onAddItemClick={
              !patientAddEnabled || !quickAddPatientEnabled
                ? null
                : handleAddPatient
            }
            addItemEnabled={patientAddEnabled && quickAddPatientEnabled}
            clearOnSuccess
            refineResultsCount={MAX_PATIENT_RESULTS}
            width={600}
          />
        </div>
      )}
    </PatientMainContainer>
  );
};

export default PatientSection;
