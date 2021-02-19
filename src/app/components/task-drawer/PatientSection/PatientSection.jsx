import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as AlertActions from 'alert/actions';
import { useFormContext } from 'react-hook-form';
import debounce from 'lodash.debounce';
import { getPatientsByCriteria, addPatient } from 'api/patient-api';
import { noop } from 'helpers/utility-functions';
import { AdornmentContainer } from '../NewTaskDrawer.Styled';
import SelectDropdown from '../SelectDropdown/SelectDropdown';
import { getFormattedPatient, getFormattedPatients } from './helpers';

const PATIENT_IDENTIFIER_FIELD_NAME = 'patientIdentifier';

const PatientSection = ({
  selectedPatient,
  currentOrganization,
  autofocus,
  disabled,
  onPatientSave,
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
        await onPatientSave({
          patient: patientToSave,
          patientIdentifier: patientToSave?.patientIdentifier || null,
        });
      } catch {
        dispatch(
          AlertActions.showGlobalAlert(
            'Error updating patient, please try again later',
            'error',
          ),
        );
      }
    },
    [dispatch, onPatientSave],
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
    setValue(PATIENT_IDENTIFIER_FIELD_NAME, null);
    setPatients([]);
    await savePatient(null);
    // eslint-disable-next-line no-unused-expressions
    patientInputReference.current?.querySelector('input')?.focus();
  }, [savePatient, setValue]);

  const handlePatientSelect = useCallback(
    async selectedOption => {
      const patient = {
        patientIdentifier: selectedOption.value,
        patientName: selectedOption.displayLabel,
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
      placeholder="Who is the patient?"
      disabled={disabled}
      startAdornment={<AdornmentContainer>+</AdornmentContainer>}
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
