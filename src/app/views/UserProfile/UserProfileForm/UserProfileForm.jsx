import { Grid } from '@material-ui/core';
import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import Button from 'components/common/Button/Button';
import { FormSwitch } from 'components/common/Switch/Switch';
import {
  UniversalInput,
  UniversalMobileInputComponent,
} from 'components/common/UniversalInput/UniversalInput';
import UserAvatarUploader from 'views/UserProfile/UserAvatarUploader/UserAvatarUploader';
import Spacing from 'components/common/Spacing';
import {
  FormSwitchListItem,
  SectionSubtypography,
  SectionTypography,
  UserAvatarGrid,
  FormInfoText,
} from './styled';
import { SettingsSection, SectionHeader } from '../styled';

// const renderFormFieldDefinition = ({
//   key,
//   label,
//   required = false,
//   readOnly = false,
//   type = 'text',
//   isPhoneNumber = false,
//   PreFieldComponent,
// }) => (
//   <Grid key={key} item xs={12}>
//     {PreFieldComponent && <PreFieldComponent />}
//     <UniversalInput
//       type={type}
//       name={key}
//       label={label}
//       required={required}
//       readOnly={readOnly}
//       CustomComponent={
//         isPhoneNumber ? UniversalMobileInputComponent : undefined
//       }
//     />
//   </Grid>
// );

const renderFormSwitchDefinition = ({ key, label, sublabels }) => (
  <FormSwitchListItem key={key}>
    <Grid container alignItems="flex-start" justify="space-between">
      <div>
        <SectionTypography>{label}</SectionTypography>
        {sublabels.map(sublabel => (
          <SectionSubtypography key={sublabel}>{sublabel}</SectionSubtypography>
        ))}
      </div>
      <FormSwitch name={key} />
    </Grid>
  </FormSwitchListItem>
);

const UserProfileForm = ({
  defaultValues,
  // formFieldDefinitions,
  formSwitchDefinitions,
  onSubmit,
  renderAvatarUploader = true,
  validationSchema,
}) => {
  const formMethods = useForm({
    defaultValues,
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  return (
    <FormContext {...formMethods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        autoCorrect="off"
      >
        <SettingsSection>
          <SectionHeader>My profile</SectionHeader>
          <Spacing vertical={5} />
          <Grid container spacing={2}>
            {renderAvatarUploader && (
              <UserAvatarGrid
                alignItems="center"
                container
                item
                xs={12}
                direction="row"
                wrap="nowrap"
              >
                <UserAvatarUploader />
              </UserAvatarGrid>
            )}
            <Grid container item alignItems="flex-end" spacing={2}>
              <Grid item xs={12} md={6}>
                <UniversalInput
                  type="text"
                  name="firstName"
                  label="First name"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <UniversalInput
                  type="text"
                  name="lastName"
                  label="Last name"
                  required
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <UniversalInput
                type="email"
                name="email"
                label="Email"
                readOnly
              />
            </Grid>
            <Grid item xs={12}>
              <FormInfoText>
                A valid mobile phone number is required to send an
                authentication code for HIPAA compliance
              </FormInfoText>
            </Grid>
            <Grid
              container
              item
              direction="row"
              alignItems="flex-end"
              spacing={2}
            >
              <Grid item md={6} xs={12}>
                <UniversalInput
                  name="accountPhoneNumber"
                  label="Your Mobile Phone Number"
                  required
                  readOnly
                  CustomComponent={UniversalMobileInputComponent}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <UniversalInput
                  name="workPhoneNumber"
                  label="Additional Phone Number"
                  CustomComponent={UniversalMobileInputComponent}
                />
              </Grid>
            </Grid>
            <Grid
              container
              item
              direction="row"
              alignItems="flex-end"
              spacing={2}
            >
              <Grid item md={6} xs={12}>
                <UniversalInput name="title" label="Title" required />
              </Grid>
              <Grid item md={6} xs={12}>
                <UniversalInput name="department" label="Department" />
              </Grid>
            </Grid>
          </Grid>
        </SettingsSection>
        <SettingsSection>
          <SectionHeader>Preferences</SectionHeader>
          <Spacing vertical={5} />
          <Grid container spacing={2}>
            {formSwitchDefinitions?.length > 0 && (
              <Grid item xs={12}>
                {formSwitchDefinitions.map(renderFormSwitchDefinition)}
              </Grid>
            )}
          </Grid>
        </SettingsSection>
        <Grid container xs={12} justify="flex-end">
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              fullWidth
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader size={LoaderSizes.medium} /> : 'Save'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormContext>
  );
};

export default UserProfileForm;
