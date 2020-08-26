import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { updateOrganizationName } from 'actions/organization-actions';
import Button from 'components/common/Button/Button';
import OrganizationAvatarInput from 'components/organization/OrganizationAvatarInput/OrganizationAvatarInput';
import OrganizationColorPicker from 'components/organization/OrganizationColorPicker/OrganizationColorPicker';
import Spacing from 'components/common/Spacing';
import Input from 'components/common/Input/Input';
import { useForm } from 'react-hook-form';
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

const onSubmit = ({
  dispatch,
  closeModal,
  confirm,
  organizationIdentifier,
}) => ({
  organizationName,
  organizationInitials,
  organizationProfileColor,
}) => {
  updateOrganizationName({
    organizationIdentifier,
    organizationName,
    organizationInitials,
    organizationProfileColor,
  })(dispatch).then(() => {
    confirm();
    closeModal();
  });
};

const EditOrganizationModal = ({ closeModal, userProfile, confirm }) => {
  const dispatch = useDispatch();

  const formContext = useForm({
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
    errors,
    handleSubmit,
    formState: { isSubmitting },
  } = formContext;

  const organizationNameValue = watch('organizationName');
  const organizationInitialsValue = watch('organizationInitials');
  const organizationProfileColorValue = watch('organizationProfileColor');

  useEffect(() => {
    register(
      {
        name: 'organizationName',
      },
      {
        validate: value => {
          if (![...value]?.filter(char => char !== ' ').length > 0) {
            return 'This field is required';
          }

          return true;
        },
      },
    );
    register(
      { name: 'organizationInitials' },
      {
        minLength: {
          value: 2,
          message: 'Your initials must contain at least 2 letters',
        },
      },
    );
    register({
      name: 'organizationProfileColor',
    });

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
            closeModal,
            confirm,
            organizationIdentifier: userProfile?.organizationIdentifier,
          }),
        )}
      >
        <Input
          ref={register}
          error={errors?.organizationName?.message}
          fullWidth
          label="What is the name of your organization?"
          name="organizationName"
          required
          showError
          centerizedLabelOnStart
          value={organizationNameValue}
        />
        <Spacing vertical={4} />
        <TileSettingsHeader>Create your organization tile</TileSettingsHeader>
        <Spacing vertical={3} />
        <TileSettingsDescription>
          2-3 initials to represent your organization
        </TileSettingsDescription>
        <Spacing vertical={4} />
        <OrganizationAvatarInput
          name="organizationInitials"
          placeholder="abc"
          onChange={event => {
            const newValue = event.target.value.trim().toUpperCase();

            if (newValue.length > 3) {
              setValue('organizationInitials', newValue.slice(0, 3));
            } else {
              setValue('organizationInitials', newValue);
            }
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
        <OrganizationColorPicker
          name="organizationProfileColor"
          onChange={event => {
            const { name, value } = event.target;
            setValue(name, value);
          }}
          value={organizationProfileColorValue}
        />
        <Spacing vertical={6} />
        <Grid container direction="row" justify="flex-end" alignItems="center">
          <SaveButtonWrapper>
            <Button fullWidth disabled={isSubmitting} type="submit">
              Save
            </Button>
          </SaveButtonWrapper>
        </Grid>
      </OrganizationForm>
    </EditOrganizationModalWrapper>
  );
};

export default EditOrganizationModal;
