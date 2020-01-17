import {
  SET_ONBOARDING_PROGRESS,
  SET_ONBOARDING_STEP,
  SET_ONBOARDING_TOTAL_STEPS,
} from '../actions/action-types';
import ONBOARDING_STEPS from '../views/onboarding/OnboardingTemplate.OnboardingSteps';

const initialState = {
  currentStep: 1,
  progress: 0.1,
  totalSteps: ONBOARDING_STEPS.length,
};

const calculateProgressFromCurrentStep = ({ currentStep, totalSteps }) =>
  initialState.progress + (currentStep - 1) / totalSteps;

const reducer = (state = initialState, { type, ...payload }) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (type) {
    case SET_ONBOARDING_PROGRESS: {
      return {
        ...state,
        progress: payload?.progress ?? initialState.progress,
      };
    }
    case SET_ONBOARDING_STEP: {
      const currentStep = payload?.currentStep ?? initialState.currentStep;

      return {
        ...state,
        currentStep,
        progress: calculateProgressFromCurrentStep({
          currentStep,
          totalSteps: state.totalSteps,
        }),
      };
    }
    case SET_ONBOARDING_TOTAL_STEPS: {
      return {
        ...state,
        totalSteps: payload?.totalSteps ?? initialState?.totalSteps,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

export default reducer;
