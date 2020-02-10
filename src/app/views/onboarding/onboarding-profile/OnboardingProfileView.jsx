import Grid from '@material-ui/core/Grid';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import { setOnboardingCurrentStep } from '../../../actions/onboarding-progress-actions';
import * as userApi from '../../../api/user-api';
import { showAlert, showToast } from '../../../helpers/utility-functions';
import UserProfileView from '../../UserProfileView';
import {
  OnboardingButton,
  OnboardingH2,
  OnboardingH2Bold,
  OnboardingHorizontalSpacing3,
  OnboardingSpacing5,
} from '../OnboardingTemplate.Components';
import {
  formFieldDefinitions,
  formSwitchDefinitions,
} from './OnboardingProfileView.FormDefinitions';
import validationSchema from './OnboardingProfileView.ValidationSchema';

const goToOnboardingFinished = () => {
  hashHistory.push('/onboarding/finished');
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
        specialtyId: otherSpecialty.specialtyId,
        subSpecialties: [
          {
            subSpecialtyId: otherSubspecialty.subSpecialtyId,
            subSpecialtyName: requestData.subspecialty,
          },
        ],
      },
    ];

    requestData.titles = [
      {
        name: requestData.title,
        titleId: otherTitle.titleId,
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

    goToOnboardingFinished();
  } catch {
    showAlert({
      title: 'Error updating profile, please try again later',
      status: 'error',
    });
  }
};

const OnboardingProfileView = () => {
  const dispatch = useDispatch();

  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 5 })(dispatch);
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
            <OnboardingSpacing5 />
            <Grid container justify="flex-end">
              <OnboardingButton
                onClick={goToOnboardingFinished}
                variant="outlined"
              >
                <OnboardingH2>Skip</OnboardingH2>
              </OnboardingButton>
              <OnboardingHorizontalSpacing3 />
              <OnboardingButton type="submit" variant="contained">
                <OnboardingH2Bold>Save & Complete</OnboardingH2Bold>
              </OnboardingButton>
            </Grid>
          </>
        }
      />
    </div>
  );
};

export default OnboardingProfileView;
