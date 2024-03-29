import {
  getAdditionalPatientOptions,
  getAdditionalUserOptions,
  getAdditionalTaskOptions,
} from '../EditCustomFieldModal/helpers';

export const getAdditionalOptions = ({
  displayOptionsState,
  handleDisplayOptionChange,
  type,
}) => {
  switch (type) {
    case 'PATIENT': {
      return getAdditionalPatientOptions({
        displayOptionsState,
        handleDisplayOptionChange,
      });
    }

    case 'PROVIDER': {
      return getAdditionalUserOptions({
        displayOptionsState,
        handleDisplayOptionChange,
      });
    }

    case 'TASK': {
      return getAdditionalTaskOptions({
        displayOptionsState,
        handleDisplayOptionChange,
      });
    }

    default: {
      return null;
    }
  }
};
