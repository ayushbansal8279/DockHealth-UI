import {
  SET_ONBOARDING_PROGRESS,
  SET_ONBOARDING_STEP,
  SET_ONBOARDING_TOTAL_STEPS,
} from './action-types';

export const setOnboardingProgress = ({ progress }) => dispatch => {
  dispatch({ type: SET_ONBOARDING_PROGRESS, progress });
};

export const setOnboardingCurrentStep = ({ currentStep }) => dispatch => {
  dispatch({ type: SET_ONBOARDING_STEP, currentStep });
};

export const setOnboardingTotalSteps = ({ totalSteps }) => dispatch => {
  dispatch({ type: SET_ONBOARDING_TOTAL_STEPS, totalSteps });
};
