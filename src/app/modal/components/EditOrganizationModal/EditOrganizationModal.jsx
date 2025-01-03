import React, { useEffect } from 'react';
import { Grid } from '@mui/material';
import OfficeIcon from 'img/modals/office.svg';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from 'modal/actions';
import { updateOrganization } from 'actions/organization-actions';
import InitialsInput from 'components/common/InitialsInput/InitialsInput';
import ColorPicker from 'components/common/ColorPicker/ColorPicker';
import Spacing from 'components/common/Spacing';
import FormInput from 'components/common/Input/FormInput';
import { FormProvider, useForm } from 'react-hook-form';
import { userProfileSelector } from 'selectors/user-selectors';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import {
  EditOrganizationModalWrapper,
  Title,
  OrganizationForm,
  InitialsError,
  TileSettingsHeader,
  TileSettingsDescription,
  ColorPickerHeader,
  SaveButtonWrapper,
} from './styled';
import { CloseIconButton, CloseIcon } from '../styled';
import CustomerTypeDropDown from './CustomerTypeDropDown/CustomerTypeDropDown';
import { ConfirmButton } from '../ModalButton/ModalButtons';

const validateOrganizationName = (value) => {
  if (![...value]?.filter((char) => char !== ' ').length > 0) {
    return 'This field is required';
  }

  return true;
};

const onSubmit =
  ({ dispatch, onSuccess, organizationIdentifier }) =>
  ({
    organizationName,
    organizationInitials,
    organizationProfileColor,
    customerType,
  }) => {
    const selectedType = [
      { name: 'Patients', key: 'PATIENT' },
      { name: 'Clients', key: 'CLIENT' },
      { name: 'Members', key: 'MEMBER' },
      { name: 'Customers', key: 'CUSTOMER' },
    ].find((element) => element.key === customerType.toUpperCase());

    const type = {
      selectedRecord: selectedType,
    };

    updateOrganization({
      organizationIdentifier,
      organizationName,
      organizationInitials,
      organizationProfileColor,
      customerType: type.selectedRecord.key,
    }).then(() => {
      onSuccess();
      dispatch(
        openModal('Confirmation', {
          description: 'Changes to your Organization have been saved.',
          icon: OfficeIcon,
          altIcon: 'Organization',
        }),
      );
      window.location.reload(false);
    });
  };

const EditOrganizationModal = ({ closeModal, userProfile, onSuccess }) => {
  const dispatch = useDispatch();

  const currentUser = useSelector(userProfileSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);

  const customerTypesList = [
    { name: 'Patients', identifier: 'PATIENT' },
    { name: 'Clients', identifier: 'CLIENT' },
    { name: 'Members', identifier: 'MEMBER' },
    { name: 'Customers', identifier: 'CUSTOMER' },
  ];

  const formMethods = useForm({
    defaultValues: {
      organizationName: userProfile.organizationName,
      organizationInitials: userProfile.organizationInitials,
      organizationProfileColor: userProfile.organizationProfileColor,
      customerType: customerTypeLabel,
    },
    revalidationMode: 'onChange',
  });

  const {
    register,
    unregister,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = formMethods;

  const organizationInitialsValue = watch('organizationInitials');
  const organizationProfileColorValue = watch('organizationProfileColor');

  useEffect(() => {
    register('organizationInitials', {
      minLength: {
        value: 2,
        message: 'Your initials must contain at least 2 letters',
      },
    });
    register('organizationProfileColor');
    register('customerType');

    return () => {
      unregister('organizationName');
      unregister('organizationInitials');
      unregister('organizationProfileColor');
      unregister('customerType');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <EditOrganizationModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Title>Edit Your Organization</Title>
      <Spacing vertical={4} />
      <OrganizationForm
        onSubmit={handleSubmit(
          onSubmit({
            dispatch,
            onSuccess,
            organizationIdentifier: userProfile?.organizationIdentifier,
          }),
        )}
      >
        <FormProvider {...formMethods}>
          <FormInput
            autoFocus
            label="Organization name"
            placeholder="What is the name of your organization?"
            name="organizationName"
            required
            validate={validateOrganizationName}
          />
          <Spacing vertical={4} />
          <TileSettingsHeader>Create your organization tile</TileSettingsHeader>
          <Spacing vertical={3} />
          <TileSettingsDescription>
            2-3 initials to represent your organization
          </TileSettingsDescription>
          <Spacing vertical={4} />
          <InitialsInput
            name="organizationInitials"
            placeholder="abc"
            onChange={(v) => {
              setValue('organizationInitials', v);
            }}
            value={organizationInitialsValue}
            backgroundColor={organizationProfileColorValue}
          />
          {errors?.organizationInitials && (
            <>
              <Spacing vertical={2} />
              <InitialsError>
                {errors?.organizationInitials?.message}
              </InitialsError>
            </>
          )}
          <Spacing vertical={3} />
          <ColorPickerHeader>Choose your theme color</ColorPickerHeader>
          <Spacing vertical={3} />
          <ColorPicker
            name="organizationProfileColor"
            onChange={(event) => {
              const { name, value } = event.target;
              setValue(name, value);
            }}
            value={organizationProfileColorValue}
          />
          <Spacing vertical={4} />
          <TileSettingsHeader>
            What do you call your customers?
          </TileSettingsHeader>
          <CustomerTypeDropDown
            name="clientType"
            value={customerTypeLabel.toUpperCase()}
            onChange={(event) => {
              setValue('customerType', event);
            }}
            field={{
              options: customerTypesList,
            }}
          />
          <Spacing vertical={4} />
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <SaveButtonWrapper>
              <ConfirmButton disabled={isSubmitting} type="submit">
                Save
              </ConfirmButton>
            </SaveButtonWrapper>
          </Grid>
        </FormProvider>
      </OrganizationForm>
    </EditOrganizationModalWrapper>
  );
};

export default EditOrganizationModal;
