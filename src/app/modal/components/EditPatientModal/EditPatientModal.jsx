import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import FormInput from 'components/common/Input/FormInput';
import Button from 'components/common/Button/Button';
import FormSelect from 'components/common/Select/FormSelect';
import { yupResolver } from '@hookform/resolvers/yup';
import DateInput from 'components/common/DateInput/DateInput';
import moment from 'moment';
import Spacing from 'components/common/Spacing';
import mergeDeepRight from 'ramda/src/mergeDeepRight';
import FormPhoneNumberInput from 'components/common/PhoneNumberInput/FormPhoneNumberInput';
import { getCustomerUniqueIDLabel } from 'helpers/customer-type-helper';
import {
  selectedUserOrganizationSelector,
  userProfileSelector,
} from 'selectors/user-selectors';
import { updatePatientDetails } from 'actions/patient-details-actions';
import { CloseIconButton, CloseIcon } from '../styled';
import {
  AddPatientFieldModalWrapper,
  Title,
  ButtonGroupFlexStyled,
  ContactStepFormStyled,
} from './styled';
import { GENDER_OPTIONS_BIRTH, validationSchema } from './helpers';

const EditPatientModal = ({ closeModal, patient, onAdded }) => {
  const editMode = !!patient;
  const dispatch = useDispatch();
  const currentUser = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const uniqueIdentifierLabel = getCustomerUniqueIDLabel(
    currentUser,
    currentOrganization,
  );

  const formattedDob = patient?.dob
    ? moment(patient.dob).format('MM/DD/YYYY')
    : null;

  const patientValues = {
    ...patient,
    dob: formattedDob,
  };

  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onSubmit',
    defaultValues: patientValues,
  });

  const onSubmit = data => {
    const { patientIdentifier } = patient;
    const updateData = mergeDeepRight(patient, data);
    updateData.allNotes = undefined;
    updateData.patientLabels = undefined;
    updateData.createdDateTime = undefined;
    updateData.updatedDateTime = undefined;
    onAdded(updateData);
    dispatch(updatePatientDetails(patientIdentifier, updateData));
    closeModal();
  };

  return (
    <AddPatientFieldModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Title>{editMode ? 'Edit' : 'Add'} Patient</Title>
      <Box m={2} />
      <Box display="flex" flex={1} width="100%">
        <FormProvider {...formMethods}>
          <ContactStepFormStyled onSubmit={formMethods.handleSubmit(onSubmit)}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Grid container spacing={1}>
                  <Grid item xs={5}>
                    <FormInput
                      readOnly={false}
                      label="First Name"
                      name="firstName"
                      required
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInput
                      readOnly={false}
                      label="Middle Name"
                      name="middleName"
                      xs={2}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <FormInput
                      readOnly={false}
                      label="Last Name"
                      name="lastName"
                      required
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container direction="row" spacing={1}>
                  <Grid item xs={6}>
                    <FormSelect
                      readOnly={false}
                      label="Sex at birth"
                      options={GENDER_OPTIONS_BIRTH}
                      name="gender"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormInput
                      readOnly={false}
                      label="Date of Birth"
                      placeholder="MM/DD/YYYY"
                      inputComponent={DateInput}
                      showCalanderIcon={false}
                      name="dob"
                      maxDate={moment().toISOString()}
                      // setError={setError}
                      clearErrors={() => {}}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <FormInput
                      readOnly={false}
                      label={uniqueIdentifierLabel}
                      placeholder="- -"
                      name="mrn"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormInput readOnly={false} label="Email" name="email" />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <FormPhoneNumberInput
                      readOnly={false}
                      label="Mobile Phone"
                      name="phoneMobile"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormPhoneNumberInput
                      readOnly={false}
                      label="Home Phone"
                      name="phoneHome"
                      type="tel"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Spacing vertical={3} />
              <Grid item>
                <ButtonGroupFlexStyled disabled={false}>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </ButtonGroupFlexStyled>
              </Grid>
            </Grid>
          </ContactStepFormStyled>
        </FormProvider>
      </Box>
    </AddPatientFieldModalWrapper>
  );
};

export default EditPatientModal;
