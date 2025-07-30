/* eslint-disable no-unused-expressions */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  userHasAiSummaryViewFeatureSelector,
  userProfileSelector,
} from 'selectors/user-selectors';
import { organizationSelector } from 'selectors/organization-selectors';
import debounce from 'lodash.debounce';
// import { openModal } from 'modal/actions';
import { getPatientsByCriteria } from 'api/patients-api';
import { addPatient } from 'api/patient-api';
// import { changePatientForTemplateBundle } from 'actions/template-bundle-actions';
import { noop } from 'helpers/utility-functions';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
// import { capitalize } from 'helpers/capitalize';
import SelectDropdown from 'components/task-drawer/SelectDropdown/SelectDropdown';
import {
  workflowSelector,
  workflowAutofocusFieldSelector,
} from 'selectors/workflow-drawer-selectors';
import { WorkflowDrawerFieldNames } from 'helpers/workflow-drawer-helpers';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import {
  getFormattedPatient,
  getFormattedPatients,
  hasRestrictedPatientLookup,
} from 'components/task-drawer/PatientSection/helpers';
import { useHistory, useLocation } from 'react-router-dom';
import {
  PatientMainContainer,
  PatientContainer,
  Title,
  InstructionText,
  PatientName,
  PatientLableContainer,
  AISummaryWrapper,
} from './styled';
import PatientSelectItem from '../../patients/PatientSelectItem/PatientSelectItem';
import AISummaryModalOpenerHelper from '@/app/modal/components/AISummaryModal/AISummaryModalOpenerHelper';
import { SummaryType } from '@/app/helpers/ai-helper';
import { openModal } from '@/app/modal/actions';
import { useIsWorkspaceScopedList } from '@/app/hooks/useIsWorkspaceScopedList';

const PATIENT_IDENTIFIER_FIELD_NAME = 'patientIdentifier';
const MAX_PATIENT_RESULTS = 200;

const PatientSection = ({
  disabled,
  quickAddPatientEnabled,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const dispatch = useDispatch();
  const { pathname, search } = useLocation();
  const history = useHistory();
  const patientInputReference = useRef(null);
  const [patients, setPatients] = useState([]);
  const [assignedPatient, setAssignedPatient] = useState(null);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const currentUser = useSelector(userProfileSelector);
  const selectedWorkflow = useSelector(workflowSelector);
  const [selectedPatient, setSelectedPatient] = useState(
    selectedWorkflow?.patient,
  );
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
  // const customerTypeLabelCapitalized = capitalize(customerTypeLabel);
  const autoFocusFieldName = useSelector(workflowAutofocusFieldSelector);

  const { emrIntegrationType } = useSelector(organizationSelector) || {};
  const restrictedLookup = hasRestrictedPatientLookup(emrIntegrationType);
  const aiSummaryAvailable = useSelector(userHasAiSummaryViewFeatureSelector);
  const { workspaceIdentifier } = useIsWorkspaceScopedList();

  useEffect(() => {
    if (
      patientInputReference.current &&
      autoFocusFieldName === WorkflowDrawerFieldNames.PATIENT
    ) {
      patientInputReference.current
        .querySelector('input')
        ?.scrollIntoView(true);
      patientInputReference.current.querySelector('input')?.focus();
    }
  }, [autoFocusFieldName]);

  useEffect(() => {
    if (selectedPatient) {
      setPatients([selectedPatient]);
      setAssignedPatient(getFormattedPatient(selectedPatient));
    } else {
      setAssignedPatient(null);
    }
  }, [selectedPatient]);

  const savePatient = useCallback(
    async (patientToSave) => {
      const patientIdentifier =
        patientToSave?.patientIdentifier ?? 'UNASSIGNED';
      dispatch(
        updatePartialWorkflow(selectedWorkflow?.identifier, {
          patientIdentifier,
        }),
      );
    },
    [dispatch, selectedWorkflow],
  );

  const fetchPatients = useCallback(
    (value) =>
      getPatientsByCriteria(value, null, workspaceIdentifier).then((fetchedPatients) => {
        setPatients(fetchedPatients);
        return fetchedPatients;
      }),
    [],
  );

  const fetchPatientsWithDebounce = useCallback(
    debounce((value) => {
      fetchPatients(value).then(() => {
        setIsLoadingPatients(false);
      });
    }, 500),
    [],
  );

  const onPatientInputChange = useCallback(
    (value) => {
      if (value === '') {
        fetchPatientsWithDebounce.cancel();
        setPatients([]);
      } else {
        setIsLoadingPatients(true);
        if (!restrictedLookup) {
          fetchPatientsWithDebounce(value);
        }
      }
    },
    [fetchPatientsWithDebounce, restrictedLookup],
  );

  const onEnterPress = useCallback(
    (value) => {
      setIsLoadingPatients(true);
      fetchPatientsWithDebounce(value);
    },
    [fetchPatientsWithDebounce],
  );

  const handleClearSelectedPatient = useCallback(
    async (clearInput) => {
      setAssignedPatient(null);

      setPatients([]);
      await savePatient(null);
      setSelectedPatient(null);
    },
    [savePatient],
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
      setSelectedPatient(patient);
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

      dispatch(
        openModal('EditPatient', {
          patient: data,
          onAdded: (newPatientData) => {
            addPatient(newPatientData, workspaceIdentifier)
              .then(async ({ patientIdentifier, firstName, lastName }) => {
                await fetchPatients(patient);
                await handlePatientSelect({
                  value: patientIdentifier,
                  displayLabel: `${lastName}, ${firstName} `,
                });
              })
              .catch(noop);
          },
          mode: 'add',
        }),
      );
    },
    [patientAddEnabled, fetchPatients, dispatch, handlePatientSelect],
  );

  const patientProfile = () => {
    history.push({
      pathname: `/core/patient/${selectedPatient.patientIdentifier}`,
      state: { from: search ? pathname + search : pathname },
    });
  };

  return (
    <PatientMainContainer>
      <Title>Patient</Title>
      {selectedPatient && (
        <PatientLableContainer>
          <PatientContainer>
            {' '}
            <PatientName
              status={selectedPatient.patientStatus}
              onClick={patientProfile}
            >
              {selectedPatient.patientName}{' '}
              {selectedPatient.mrn && selectedPatient.mrn !== ''
                ? `(${selectedPatient.mrn})`
                : ''}
            </PatientName>
            <button
              style={{ color: '#8492A4' }}
              onClick={handleClearSelectedPatient}
              type="button"
            >
              x
            </button>
          </PatientContainer>
          {aiSummaryAvailable && (
            <AISummaryWrapper>
              <AISummaryModalOpenerHelper
                type={SummaryType.PATIENT}
                title={`${selectedPatient?.lastName}, ${selectedPatient?.firstName}`}
                identifier={selectedPatient?.patientIdentifier}
              />
            </AISummaryWrapper>
          )}
        </PatientLableContainer>
      )}

      {!selectedPatient && (
        <div style={{ display: 'flex' }}>
          <SelectDropdown
            ref={patientInputReference}
            name={PATIENT_IDENTIFIER_FIELD_NAME}
            placeholder={
              emrIntegrationType === 'FHIR'
                ? `Add ${customerTypeLabel} (type MRN #)`
                : `Add ${customerTypeLabel} (type first last or last, first)`
            }
            disabled={disabled}
            selectedOption={assignedPatient}
            options={formattedPatients}
            headerOption={
              <PatientSelectItem
                patient={{ name: 'Name', dob: 'DOB', mrn: 'MRN' }}
                header
              />
            }
            isLoadingOptions={isLoadingPatients}
            onInputChange={onPatientInputChange}
            onEnterPress={onEnterPress}
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
            width={400}
          />
          {restrictedLookup && !selectedPatient && (
            <InstructionText>Press enter to search</InstructionText>
          )}
        </div>
      )}
    </PatientMainContainer>
  );
};

export default PatientSection;
