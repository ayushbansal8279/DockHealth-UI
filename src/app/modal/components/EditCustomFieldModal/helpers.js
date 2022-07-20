export const getAdditionalPatientOptions = ({
  displayOptionsState,
  handleDisplayOptionChange,
}) => [
  {
    label: 'Include on Patient Header',
    key: 'PATIENT_HEADER',
    value: !!displayOptionsState?.displayOptions?.find(
      option => option === 'PATIENT_HEADER',
    ),
    onChange: value => handleDisplayOptionChange(value, 'PATIENT_HEADER'),
  },
  {
    label: 'Include on Patient Search',
    key: 'PATIENT_SEARCH',
    value: !!displayOptionsState?.displayOptions?.find(
      option => option === 'PATIENT_SEARCH',
    ),
    onChange: value => handleDisplayOptionChange(value, 'PATIENT_SEARCH'),
  },
  {
    label: 'Include on Patient List',
    key: 'PATIENT_LIST',
    value: !!displayOptionsState?.displayOptions?.find(
      option => option === 'PATIENT_LIST',
    ),
    onChange: value => handleDisplayOptionChange(value, 'PATIENT_LIST'),
  },
];

export const getAdditionalUserOptions = ({
  displayOptionsState,
  handleDisplayOptionChange,
}) => [
  {
    label: 'Include on User Profile Header',
    key: 'PROVIDER_HEADER',
    value: !!displayOptionsState?.displayOptions?.find(
      option => option === 'PROVIDER_HEADER',
    ),
    onChange: value => handleDisplayOptionChange(value, 'PROVIDER_HEADER'),
  },
  {
    label: 'Include on User List',
    key: 'PROVIDER_LIST',
    value: !!displayOptionsState?.displayOptions?.find(
      option => option === 'PROVIDER_LIST',
    ),
    onChange: value => handleDisplayOptionChange(value, 'PROVIDER_LIST'),
  },
];

export const getAdditionalOptions = ({
  displayOptionsState,
  handleDisplayOptionChange,
  type,
}) => {
  switch (type) {
    case 'PATIENT':
      return getAdditionalPatientOptions({
        displayOptionsState,
        handleDisplayOptionChange,
      });

    case 'PROVIDER':
      return getAdditionalUserOptions({
        displayOptionsState,
        handleDisplayOptionChange,
      });

    default:
      return null;
  }
};
