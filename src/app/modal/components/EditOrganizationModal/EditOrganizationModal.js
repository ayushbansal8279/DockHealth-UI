import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import OfficeIcon from 'img/modals/office';
import { useDispatch } from 'react-redux';
import { openModal } from 'modal/actions';
import { updateOrganization } from 'actions/organization-actions';
import Button from 'components/common/Button/Button';
import InitialsInput from 'components/common/InitialsInput/InitialsInput';
import ColorPicker from 'components/common/ColorPicker/ColorPicker';
import Spacing from 'components/common/Spacing';
import FormInput from 'components/common/Input/FormInput';
import { FormProvider, useForm } from 'react-hook-form';
import {
  EditOrganizationModalWrapper,
  Header,
  OrganizationForm,
  InitialsError,
  TileSettingsHeader,
  TileSettingsDescription,
  ColorPickerHeader,
  SaveButtonWrapper,
} from './styled';
import { CloseIconButton, CloseIcon } from '../styled';

const validateOrganizationName = value => {
  if (![...value]?.filter(char => char !== ' ').length > 0) {
    return 'This field is required';
  }

  return true;
};

const onSubmit = ({ dispatch, onSuccess, organizationIdentifier }) => ({
  organizationName,
  organizationInitials,
  organizationProfileColor,
}) => {
  updateOrganization({
    organizationIdentifier,
    organizationName,
    organizationInitials,
    organizationProfileColor,
  })(dispatch).then(() => {
    onSuccess();
    dispatch(
      openModal('Confirmation', {
        description: 'Changes to your Organization have been saved.',
        icon: OfficeIcon,
        altIcon: 'Organization',
      }),
    );
  });
};

const EditOrganizationModal = ({ closeModal, userProfile, onSuccess }) => {
  const dispatch = useDispatch();

  const formMethods = useForm({
    defaultValues: {
      organizationName: userProfile.organizationName,
      organizationInitials: userProfile.organizationInitials,
      organizationProfileColor: userProfile.organizationProfileColor,
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

    return () => {
      unregister('organizationName');
      unregister('organizationInitials');
      unregister('organizationProfileColor');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <EditOrganizationModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Header>Edit Your Organization</Header>
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
            onChange={v => {
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
          <Spacing vertical={5} />
          <ColorPickerHeader>Choose your theme color</ColorPickerHeader>
          <Spacing vertical={3} />
          <ColorPicker
            name="organizationProfileColor"
            onChange={event => {
              const { name, value } = event.target;
              setValue(name, value);
            }}
            value={organizationProfileColorValue}
          />
          <Spacing vertical={6} />
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <SaveButtonWrapper>
              <Button disabled={isSubmitting} type="submit">
                Save
              </Button>
            </SaveButtonWrapper>
          </Grid>
        </FormProvider>
      </OrganizationForm>
    </EditOrganizationModalWrapper>
  );
};

export default EditOrganizationModal;
