import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  onTaskDrawerPatientAdded,
  onTaskDrawerTaskPatientChanged,
} from 'helpers/ga-event-helper';
import * as AlertActions from 'alert/actions';
// import { useForm, FormContext } from 'react-hook-form';
import debounce from 'lodash.debounce';
import { openModal } from 'modal/actions';
import { getPatientsByCriteria } from 'api/patients-api';
import { addPatient } from 'api/patient-api';
import { changePatientForTemplateBundle } from 'actions/template-bundle-actions';
import { noop } from 'helpers/utility-functions';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import SelectDropdown from '../SelectDropdown/SelectDropdown';
import { getFormattedPatient, getFormattedPatients } from './helpers';

const PATIENT_IDENTIFIER_FIELD_NAME = 'patientIdentifier';

const PatientSection = ({
  selectedPatient,
  autofocus,
  disabled,
  placeholder,
  onSave,
  isSubtask,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const dispatch = useDispatch();
  const patientInputReference = useRef(null);
  const [patients, setPatients] = useState([]);
  const [assignedPatient, setAssignedPatient] = useState();

  useEffect(() => {
    if (selectedPatient) {
      setPatients([selectedPatient]);
      setAssignedPatient(getFormattedPatient(selectedPatient));
    }
  }, [selectedPatient]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const currentUser = useSelector(userProfileSelector);
  const { templateBundleIdentifier } = useSelector(selectedTaskSelector) || {};

  const currentOrganizationIdentifier = sessionStorage.getItem(
    'currentOrganizationIdentifier',
  );
  const currentOrganization =
    currentUser?.userOrganizations?.find(
      ({ organizationIdentifier }) =>
        organizationIdentifier === currentOrganizationIdentifier,
    ) || {};

  const formattedPatients = getFormattedPatients({ patients });
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customerTypeLabelCapitalized = capitalize(customerTypeLabel);

  useEffect(() => {
    if (patientInputReference?.current && autofocus)
      patientInputReference.current.querySelector('input').focus();
  }, [autofocus, patientInputReference]);

  const savePatient = useCallback(
    async patientToSave => {
      try {
        const onSavePatient = async skipModals => {
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
    value =>
      getPatientsByCriteria(value).then(fetchedPatients => {
        setPatients(fetchedPatients);
        return fetchedPatients;
      }),
    [],
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
    value => {
      if (value !== '') {
        setIsLoadingPatients(true);
        fetchPatientsWithDebounce(value);
      } else {
        fetchPatientsWithDebounce.cancel();
        setPatients([]);
      }
    },
    [fetchPatientsWithDebounce],
  );

  const handleClearSelectedPatient = useCallback(
    async clearInput => {
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
            },
          }),
        );
      } else {
        setAssignedPatient(null);

        setPatients([]);
        await savePatient(null);
      }
      // eslint-disable-next-line no-unused-expressions
      patientInputReference.current?.querySelector('input')?.focus();
    },
    [dispatch, savePatient, selectedPatient, templateBundleIdentifier],
  );

  const handlePatientSelect = useCallback(
    async selectedOption => {
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
    patient => {
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
          await fetchPatients(patient);
          await handlePatientSelect({
            value: patientIdentifier,
            displayLabel: `${lastName}, ${firstName} `,
          });
        })
        .catch(noop);
    },
    [
      currentOrganization.emrIntegrationEnabled,
      fetchPatients,
      handlePatientSelect,
    ],
  );

  return (
    <SelectDropdown
      ref={patientInputReference}
      name={PATIENT_IDENTIFIER_FIELD_NAME}
      label={customerTypeLabelCapitalized}
      placeholder={placeholder || `Who is the ${customerTypeLabel}?`}
      disabled={disabled}
      selectedOption={assignedPatient}
      options={formattedPatients}
      isLoadingOptions={isLoadingPatients}
      onInputChange={onPatientInputChange}
      onOptionSelect={handlePatientSelect}
      onClear={handleClearSelectedPatient}
      onAddItemClick={
        currentOrganization?.emrIntegrationEnabled ? null : handleAddPatient
      }
      addItemEnabled={!currentOrganization?.emrIntegrationEnabled}
      clearOnSuccess
    />
  );
};

export default PatientSection;
