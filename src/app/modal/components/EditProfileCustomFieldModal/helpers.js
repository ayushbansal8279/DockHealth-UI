export const getAdditionalPatientOptions = ({
  displayOptionsState,
  handleDisplayOptionChange,
}) => [
  {
    label: 'Include on Patient Header',
    key: 'PATIENT_HEADER',
    value: !!displayOptionsState?.displayOptions?.find(
      (option) => option === 'PATIENT_HEADER',
    ),
    onChange: (value) => handleDisplayOptionChange(value, 'PATIENT_HEADER'),
  },
  {
    label: 'Include for Patient Search',
    key: 'PATIENT_SEARCH',
    value: !!displayOptionsState?.displayOptions?.find(
      (option) => option === 'PATIENT_SEARCH',
    ),
    onChange: (value) => handleDisplayOptionChange(value, 'PATIENT_SEARCH'),
  },
  // {
  //   label: 'Include on Patient List',
  //   key: 'PATIENT_LIST',
  //   value: !!displayOptionsState?.displayOptions?.find(
  //     option => option === 'PATIENT_LIST',
  //   ),
  //   onChange: value => handleDisplayOptionChange(value, 'PATIENT_LIST'),
  // },
];

export const getAdditionalUserOptions = ({
  displayOptionsState,
  handleDisplayOptionChange,
}) => [
  {
    label: 'Include on User Profile Header',
    key: 'PROVIDER_HEADER',
    value: !!displayOptionsState?.displayOptions?.find(
      (option) => option === 'PROVIDER_HEADER',
    ),
    onChange: (value) => handleDisplayOptionChange(value, 'PROVIDER_HEADER'),
  },
  {
    label: 'Include on User List',
    key: 'PROVIDER_LIST',
    value: !!displayOptionsState?.displayOptions?.find(
      (option) => option === 'PROVIDER_LIST',
    ),
    onChange: (value) => handleDisplayOptionChange(value, 'PROVIDER_LIST'),
  },
];

export const getAdditionalTaskOptions = ({
  displayOptionsState,
  handleDisplayOptionChange,
}) => [
  {
    label: 'Required for Task completion',
    key: 'TASK_REQUIRED',
    value: !!displayOptionsState?.displayOptions?.find(
      (option) => option === 'TASK_REQUIRED',
    ),
    onChange: (value) => handleDisplayOptionChange(value, 'TASK_REQUIRED'),
  },
];

export const getAdditionalProfileOptions = ({
  displayOptionsState,
  handleDisplayOptionChange,
}) => [
  {
    label: 'Profile Name',
    key: 'PROFILE_NAME',
    value: !!displayOptionsState?.displayOptions?.find(
      (option) => option === 'PROFILE_NAME',
    ),
    onChange: (value) => handleDisplayOptionChange(value, 'PROFILE_NAME'),
  },
  {
    label: 'Profile Header',
    key: 'PROFILE_HEADER',
    value: !!displayOptionsState?.displayOptions?.find(
      (option) => option === 'PROFILE_HEADER',
    ),
    onChange: (value) => handleDisplayOptionChange(value, 'PROFILE_HEADER'),
  },
];

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

    case 'PROFILE': {
      return getAdditionalProfileOptions({
        displayOptionsState,
        handleDisplayOptionChange,
      });
    }

    default: {
      return null;
    }
  }
};
