import { Grid, List, ListItem } from '@material-ui/core';
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
import {
  FormSwitchListItem,
  SectionSubtypography,
  SectionTypography,
  StyledLinkLabel,
  StyledRouterLink,
  UserAvatarGrid,
} from './styled';

const renderFormFieldDefinition = ({
  key,
  label,
  required = false,
  readOnly = false,
  type = 'text',
  isPhoneNumber = false,
  PreFieldComponent,
}) => (
  <Grid key={key} item xs={12}>
    {PreFieldComponent && <PreFieldComponent />}
    <UniversalInput
      type={type}
      name={key}
      label={label}
      required={required}
      readOnly={readOnly}
      CustomComponent={
        isPhoneNumber ? UniversalMobileInputComponent : undefined
      }
    />
  </Grid>
);

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
  formFieldDefinitions,
  formSwitchDefinitions,
  onSubmit,
  renderAvatarUploader = true,
  saveButtonProps = {},
  showSignInLabel = false,
  validationSchema,
  CustomFooter = undefined,
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

  const {
    label: saveButtonLabel = 'Save',
    ...otherSaveButtonProps
  } = saveButtonProps;

  return (
    <FormContext {...formMethods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        autoCorrect="off"
      >
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
          <Grid container item spacing={2}>
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
          {formFieldDefinitions.map(renderFormFieldDefinition)}
          {formSwitchDefinitions?.length > 0 && (
            <Grid item xs={12}>
              <List>
                <ListItem divider>
                  <SectionTypography>Notifications</SectionTypography>
                </ListItem>
                {formSwitchDefinitions.map(renderFormSwitchDefinition)}
              </List>
            </Grid>
          )}
          {CustomFooter ?? (
            <Grid item container xs={12} justify="flex-end">
              <Grid item sm={12} md={6}>
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  disabled={isSubmitting}
                  {...otherSaveButtonProps}
                >
                  {isSubmitting ? (
                    <Loader size={LoaderSizes.medium} />
                  ) : (
                    saveButtonLabel
                  )}
                </Button>
              </Grid>
            </Grid>
          )}
          <Grid item container xs={12} justify="flex-end">
            {showSignInLabel && (
              <>
                <StyledLinkLabel>I already have an account.</StyledLinkLabel>
                <StyledRouterLink to="/login">Sign in</StyledRouterLink>
              </>
            )}
          </Grid>
        </Grid>
      </form>
    </FormContext>
  );
};

export default UserProfileForm;
