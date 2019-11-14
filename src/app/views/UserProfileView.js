import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import React from 'react';
import useForm, { FormContext } from 'react-hook-form';

import CubesLoader from '../components/common/CubesLoader';
import StyledInput from '../components/userProfileView/StyledInput';
import StyledSwitch from '../components/userProfileView/StyledSwitch';
import UserAvatar from '../components/userProfileView/UserAvatar';
import {
  FormContainer,
  FormSwitchListItem,
  PlainLink,
  SectionSubtypography,
  SectionTypography,
  SubmitButton,
  UserAvatarGrid,
  UserProfileViewGrid,
  StyledRouterLink,
  StyledLinkLabel,
} from '../components/userProfileView/UserProfileView.Styled';
import { noop } from '../helpers/utilityFunctions';

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
    <StyledInput
      type={type}
      name={key}
      label={label}
      required={required}
      readOnly={readOnly}
      isPhoneNumber={isPhoneNumber}
      fontSize={16}
      backgroundColor="#f3f5f6"
      gutterBottom
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
      <StyledSwitch name={key} />
    </Grid>
  </FormSwitchListItem>
);

const UserProfileView = ({
  defaultValues,
  formContainerClassName,
  formFieldDefinitions,
  formSwitchDefinitions,
  onSubmit,
  renderAvatarUploader = true,
  saveButtonProps = {},
  showSignInLabel = false,
  validationSchema,
}) => {
  const formMethods = useForm({
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues,
    validationSchema,
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
      <FormContainer
        className={formContainerClassName}
        onSubmit={handleSubmit(isSubmitting ? noop : onSubmit)}
      >
        <Grid container justify="center">
          <UserProfileViewGrid item sm={12} md={6} container>
            {renderAvatarUploader && (
              <UserAvatarGrid
                alignItems="center"
                container
                item
                xs={12}
                direction="row"
                wrap="nowrap"
              >
                <UserAvatar />
              </UserAvatarGrid>
            )}
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
            <Grid item container xs={12} justify="flex-end">
              <Grid item sm={12} md={6}>
                <SubmitButton disabled={isSubmitting} {...otherSaveButtonProps}>
                  {isSubmitting ? (
                    <CubesLoader size={24} color="#fff" />
                  ) : (
                    saveButtonLabel
                  )}
                </SubmitButton>
              </Grid>
            </Grid>
            <Grid item container xs={12} justify="flex-end">
              {showSignInLabel ? (
                <>
                  <StyledLinkLabel>I already have an account.</StyledLinkLabel>
                  <StyledRouterLink to="/login">Sign in</StyledRouterLink>
                </>
              ) : (
                <PlainLink
                  topPadded
                  href="https://www.dock.health/privacy"
                  target="_blank"
                >
                  Privacy Policy
                </PlainLink>
              )}
            </Grid>
          </UserProfileViewGrid>
        </Grid>
      </FormContainer>
    </FormContext>
  );
};

export default UserProfileView;
