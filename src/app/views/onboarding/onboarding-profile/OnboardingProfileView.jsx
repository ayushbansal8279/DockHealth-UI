import { Grid } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import { setOnboardingCurrentStep } from '../../../actions/onboarding-progress-actions';
import {
  getBillingDetails,
  getBillingEstimate,
  getOrganizationById,
} from '../../../actions/organization-actions';
import * as userApi from '../../../api/user-api';
import Spacing from '../../../components/common/Spacing';
import { showAlert, showToast } from '../../../helpers/utility-functions';
import UserProfileView from '../../UserProfileView';
import { OnboardingButton } from '../OnboardingTemplate.Components';
import {
  formFieldDefinitions,
  formSwitchDefinitions,
} from './OnboardingProfileView.FormDefinitions';
import validationSchema from './OnboardingProfileView.ValidationSchema';

const goToMainPage = () => {
  hashHistory.push('/');
};

const onFormSubmit = ({
  otherSpecialty,
  otherSubspecialty,
  otherTitle,
}) => async data => {
  const {
    emailNotificationsEnabled,
    pushNotificationsEnabled,
    ...otherData
  } = data;

  try {
    const requestData = {};
    formFieldDefinitions
      .filter(({ readOnly = false }) => !readOnly)
      .forEach(({ key, isPhoneNumber }) => {
        const value = otherData[key];

        requestData[key] = isPhoneNumber ? value?.replace(/-/g, '') : value;
      });

    requestData.specialties = [
      {
        name: requestData.specialty,
        specialtyId: otherSpecialty ? otherSpecialty.specialtyId : undefined,
        subSpecialties: [
          {
            subSpecialtyId: otherSpecialty
              ? otherSubspecialty.subSpecialtyId
              : undefined,
            subSpecialtyName: requestData.subspecialty,
          },
        ],
      },
    ];

    requestData.titles = [
      {
        name: requestData.title,
        titleId: otherTitle ? otherTitle.titleId : undefined,
      },
    ];

    await userApi.updateUser(requestData);

    await userApi.updateUserNotoficationPrefs(
      emailNotificationsEnabled,
      pushNotificationsEnabled,
    );

    showToast({ title: 'Profile updated successfully!', status: 'success' });

    userApi.getUserById();
    userApi.getUserProfilePic(sessionStorage.userIdentifier, 'PROFILE');
    userApi.getUserNotoficationPrefs();

    goToMainPage();
  } catch (error) {
    console.log(error);
    showAlert({
      title: 'Error updating profile, please try again later',
      status: 'error',
    });
  }
};

const OnboardingProfileView = () => {
  const dispatch = useDispatch();

  const organizationIdentifier = useSelector(
    store => store.userState?.userProfile?.organizationIdentifier,
  );

  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 5 })(dispatch);

    getOrganizationById({ organizationIdentifier })(dispatch);
    getBillingDetails({ organizationIdentifier })(dispatch);
    getBillingEstimate()(dispatch);
  });

  const otherEntries = useSelector(store => {
    const otherSpecialty = store.userState.allSpecialties?.find(
      ({ name }) => name === 'Other',
    );
    const otherSubspecialty = otherSpecialty?.subSpecialties?.find(
      ({ subSpecialtyName }) => subSpecialtyName === 'Other',
    );
    const otherTitle = store.userState.allTitles?.find(
      ({ name }) => name === 'Other',
    );

    return {
      otherSpecialty,
      otherSubspecialty,
      otherTitle,
    };
  });

  return (
    <div>
      <UserProfileView
        defaultValues={{
          emailNotificationsEnabled: true,
          pushNotificationsEnabled: true,
        }}
        formContainerClassName=""
        formFieldDefinitions={formFieldDefinitions}
        formSwitchDefinitions={formSwitchDefinitions}
        onSubmit={onFormSubmit({ ...otherEntries })}
        validationSchema={validationSchema}
        renderAvatarUploader
        showPrivacyPolicyLink={false}
        CustomFooter={
          <>
            <Spacing vertical={6} />
            <Grid container justify="flex-end">
              <OnboardingButton onClick={goToMainPage} variant="outlined">
                Skip
              </OnboardingButton>
              <Spacing horizontal={4} />
              <OnboardingButton type="submit" variant="contained">
                Save & Complete
              </OnboardingButton>
            </Grid>
          </>
        }
      />
    </div>
  );
};

export default OnboardingProfileView;
