import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  onTaskDrawerPatientAdded,
  onTaskDrawerTaskPatientChanged,
} from 'helpers/ga-event-helper';
import * as AlertActions from 'alert/actions';
import { useFormContext } from 'react-hook-form';
import debounce from 'lodash.debounce';
import { openModal } from 'modal/actions';
import { getPatientsByCriteria, addPatient } from 'api/patient-api';
import { changePatientForTemplateBundle } from 'actions/template-bundle-actions';
import { noop } from 'helpers/utility-functions';
import { AdornmentContainer } from '../styled';
import SelectDropdown from '../SelectDropdown/SelectDropdown';
import { getFormattedPatient, getFormattedPatients } from './helpers';

const PATIENT_IDENTIFIER_FIELD_NAME = 'patientIdentifier';

const PatientSection = ({
  selectedPatient,
  currentOrganization,
  autofocus,
  disabled,
  placeholder,
  onSave,
  taskGroupIdentifier,
  templateBundleIdentifier,
  isSubtask,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const dispatch = useDispatch();
  const patientInputReference = useRef(null);
  const [patients, setPatients] = useState([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);

  const formattedPatients = getFormattedPatients({ patients });

  const { register, unregister, setValue } = useFormContext();

  useEffect(() => {
    register(PATIENT_IDENTIFIER_FIELD_NAME);
    return () => {
      unregister(PATIENT_IDENTIFIER_FIELD_NAME);
      setPatients([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedPatient?.patientIdentifier) {
      setPatients([selectedPatient]);
      setValue(
        PATIENT_IDENTIFIER_FIELD_NAME,
        selectedPatient.patientIdentifier,
      );
    }
  }, [selectedPatient, setValue]);

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
                        taskGroupIdentifier,
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
                        taskGroupIdentifier,
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
                taskGroupIdentifier,
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
            'Error updating patient, please try again later',
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
      taskGroupIdentifier,
      templateBundleIdentifier,
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
    }, 300),
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

  const handleClearSelectedPatient = useCallback(async () => {
    if (templateBundleIdentifier && selectedPatient) {
      dispatch(
        openModal('UnassignPatient', {
          isWorkflowModal: true,
          confirm: async () => {
            dispatch(
              changePatientForTemplateBundle(
                templateBundleIdentifier,
                taskGroupIdentifier,
                'UNASSIGNED',
              ),
            );
            setValue(PATIENT_IDENTIFIER_FIELD_NAME, null);
            setPatients([]);
            await savePatient(null);
          },
        }),
      );
    } else {
      dispatch(
        openModal('UnassignPatient', {
          confirm: async () => {
            setValue(PATIENT_IDENTIFIER_FIELD_NAME, null);
            setPatients([]);
            await savePatient(null);
          },
        }),
      );
    }
    // eslint-disable-next-line no-unused-expressions
    patientInputReference.current?.querySelector('input')?.focus();
  }, [
    dispatch,
    savePatient,
    selectedPatient,
    setValue,
    taskGroupIdentifier,
    templateBundleIdentifier,
  ]);

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
      setValue(PATIENT_IDENTIFIER_FIELD_NAME, patient?.patientIdentifier);
      savePatient(patient);
      // eslint-disable-next-line no-unused-expressions
      patientInputReference.current?.querySelector('input')?.blur();
    },
    [savePatient, setValue],
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
      label="Patient"
      placeholder={placeholder || 'Who is the patient?'}
      disabled={disabled}
      startAdornment={!disabled && <AdornmentContainer>+</AdornmentContainer>}
      selectedOption={getFormattedPatient(selectedPatient)}
      options={formattedPatients}
      isLoadingOptions={isLoadingPatients}
      onInputChange={onPatientInputChange}
      onOptionSelect={handlePatientSelect}
      onClear={handleClearSelectedPatient}
      addItemLabel="Add patient"
      onAddItemClick={
        currentOrganization?.emrIntegrationEnabled ? null : handleAddPatient
      }
    />
  );
};

export default PatientSection;
