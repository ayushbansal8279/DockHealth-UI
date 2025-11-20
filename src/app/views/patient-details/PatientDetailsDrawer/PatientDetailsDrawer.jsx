import React, {
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useBoolean } from 'hooks/useBoolean';
import mergeDeepRight from 'ramda/src/mergeDeepRight';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  userProfileSelector,
  userHasPatientCustomFieldsFeatureSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import { FormProvider, useForm } from 'react-hook-form';
import { openModal, closeModal } from 'modal/actions';
import {
  createPatientMenuOptions,
  useArchivePatient,
  useUnarchivePatient,
  useDeletePatient,
  useHandleAddButtonClick,
  useHandleChangeScopeClick,
} from '@/app/views/profile-details/ProfileDetailsDrawer/patient-drawer-helper';
import { updatePatientDetails } from 'actions/patient-details-actions';
import PatientForm from 'components/patients/PatientForm/PatientForm';
import PatientDrawer from 'components/patients/PatientDrawer/PatientDrawer';
import { validationSchema } from 'components/patients/PatientForm/helpers';
import {
  getCustomerTypeLabel,
  getCustomerUniqueIDLabel,
} from 'helpers/customer-type-helper';
import PatientLabels from '../PatientLabels/PatientLabels';
import { scrollToError } from '@/app/helpers/ui-helper';

const PatientDetailsDrawer = ({ patient, isOpenedDetails, closeDetails }) => {
  const history = useHistory();
  const { patientIdentifier, patientStatus } = patient;
  const formattedDob = patient?.dob
    ? moment(patient.dob).format('MM/DD/YYYY')
    : null;
  const patientValues = {
    ...patient,
    dob: formattedDob,
  };

  const dispatch = useDispatch();
  const currentUser = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const patientCustomFieldsAvailable = useSelector(
    userHasPatientCustomFieldsFeatureSelector,
  );

  const isWorkspaceScoped =
    patient?.organizationIdentifier &&
    patient.organizationIdentifier !==
      currentOrganization?.organizationIdentifier;
  const workspaceId = isWorkspaceScoped ? patient.organizationIdentifier : null;

  const [isActive, setActive, unsetActive] = useBoolean(false);
  const formMethods = useForm({
    defaultValues: patientValues,
    reValidateMode: 'onSubmit',
    resolver: yupResolver(validationSchema),
  });
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const { reset, clearErrors } = formMethods;
  const formReference = useRef(null);
  const userProfile = useSelector(userProfileSelector);
  const isAdmin = checkIfUserIsOrganizationAdmin(userProfile);
  const [customFieldErrors, setCustomFieldErrors] = useState([]);

  const { emrIntegrationEnabled } = currentOrganization || {};
  const quickAddPatientEnabledItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'patient.add.enabled',
    ) || {};
  const patientAddEnabled =
    !emrIntegrationEnabled ||
    (emrIntegrationEnabled && quickAddPatientEnabledItem?.value === 'true');

  const close = () => {
    unsetActive();
    closeDetails();
    clearErrors(Object.keys(patientValues));
  };

  const handleClose = () => {
    if (isActive) {
      dispatch(
        openModal('InterruptEdit', {
          isWorkflowModal: true,
          confirm: () => {
            if (Object.keys(customFieldErrors).length > 0) {
              scrollToError(customFieldErrors);
            } else {
              formReference.current.dispatchEvent(
                new Event('submit', { cancelable: true, bubbles: true }),
              );
            }
            dispatch(closeModal());
          },
          onClose: close,
        }),
      );
    } else {
      close();
    }
  };

  useEffect(() => {
    if (isOpenedDetails) {
      reset({ ...patientValues });
      clearErrors(Object.keys(patientValues));
    } else {
      unsetActive();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenedDetails]);

  const uniqueIdentifierLabel = getCustomerUniqueIDLabel(
    currentUser,
    currentOrganization,
  );

  const archivePatient = useArchivePatient(patientIdentifier);
  const unarchivePatient = useUnarchivePatient(patientIdentifier);
  const deletePatient = useDeletePatient(patientIdentifier);

  const handleFormSubmit = (data) => {
    if (data.phoneHome === undefined) {
      data.phoneHome = '';
    }
    if (data.phoneMobile === undefined) {
      data.phoneMobile = '';
    }
    unsetActive();
    const updateData = mergeDeepRight(patient, data);
    updateData.allNotes = undefined;
    updateData.patientLabels = undefined;
    updateData.createdDateTime = undefined;
    updateData.updatedDateTime = undefined;

    dispatch(updatePatientDetails(patientIdentifier, updateData));
  };

  const handleAddButtonClick = useHandleAddButtonClick();
  const handleChangeScopeClick = useHandleChangeScopeClick(
    patient,
    workspaceId,
  );

  const contextMenuOptions = useMemo(
    () =>
      createPatientMenuOptions({
        dispatch,
        history,
        patient,
        isActive,
        setActive,
        patientAddEnabled,
        archivePatient,
        unarchivePatient,
        deletePatient,
        onClose: closeDetails,
        isAdmin,
        patientCustomFieldsAvailable,
        handleAddButtonClick,
        handleChangeScopeClick,
      }),
    [
      dispatch,
      history,
      patient,
      isActive,
      setActive,
      patientAddEnabled,
      archivePatient,
      unarchivePatient,
      deletePatient,
      closeDetails,
      isAdmin,
      patientCustomFieldsAvailable,
      handleAddButtonClick,
      handleChangeScopeClick,
    ],
  );

  return (
    <FormProvider {...formMethods}>
      <PatientDrawer
        isOpen={isOpenedDetails}
        title={`${patient.lastName}, ${patient.firstName} ${
          patient.middleName ?? ''
        }`}
        options={contextMenuOptions}
        onClose={handleClose}
      >
        <Box py={0.1} />
        <PatientLabels
          customerTypeLabel={customerTypeLabel}
          disableFocusOnRender
        />
        <Box py={1.5} />
        <PatientForm
          ref={formReference}
          patient={patient}
          onSubmit={handleFormSubmit}
          uniqueIdentifierLabel={uniqueIdentifierLabel}
          patientAddEnabled={patientAddEnabled}
          edited={isActive}
          customerTypeLabel={customerTypeLabel}
          buttonLabel="Save Edits"
          setCustomFieldErrors={setCustomFieldErrors}
        />
      </PatientDrawer>
    </FormProvider>
  );
};

export default PatientDetailsDrawer;
