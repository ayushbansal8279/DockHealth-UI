import * as Yup from 'yup';
import { DisplayOption } from '@/app/helpers/field-type-helpers';

const commonOptions = (displayOptionsState, handleDisplayOptionChange) => [
  {
    label: 'Required',
    key: DisplayOption.REQUIRED,
    value: !!displayOptionsState?.displayOptions?.includes(
      DisplayOption.TASK_REQUIRED,
    ),
    onChange: (value) =>
      handleDisplayOptionChange(value, DisplayOption.TASK_REQUIRED),
  },
  {
    label: 'Single Select',
    key: DisplayOption.SINGLE_SELECT,
    value: !!displayOptionsState?.displayOptions?.find(
      (option) => option === DisplayOption.SINGLE_SELECT,
    ),
    onChange: (value) =>
      handleDisplayOptionChange(value, DisplayOption.SINGLE_SELECT),
  },
  {
    label: 'Read only',
    key: 'READONLY',
    value: !!displayOptionsState?.displayOptions?.find(
      (option) => option === 'READONLY',
    ),
    onChange: (value) => handleDisplayOptionChange(value, 'READONLY'),
  },
  {
    label: 'Hidden',
    key: 'HIDDEN',
    value: !!displayOptionsState?.displayOptions?.find(
      (option) => option === 'HIDDEN',
    ),
    onChange: (value) => handleDisplayOptionChange(value, 'HIDDEN'),
  },
];

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
  ...commonOptions(displayOptionsState, handleDisplayOptionChange),
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
  ...commonOptions(displayOptionsState, handleDisplayOptionChange),
];

export const getAdditionalTaskOptions = ({
  displayOptionsState,
  handleDisplayOptionChange,
}) => [
  {
    label: 'Required for task completion',
    key: 'TASK_REQUIRED',
    value: !!displayOptionsState?.displayOptions?.find(
      (option) => option === 'TASK_REQUIRED',
    ),
    onChange: (value) => handleDisplayOptionChange(value, 'TASK_REQUIRED'),
  },
  ...commonOptions(displayOptionsState, handleDisplayOptionChange),
];

export const getAdditionalProfileOptions = ({
  displayOptionsState,
  handleDisplayOptionChange,
}) => [
  {
    label: 'Object Name',
    key: 'PROFILE_NAME',
    value: !!displayOptionsState?.displayOptions?.find(
      (option) => option === 'PROFILE_NAME',
    ),
    onChange: (value) => handleDisplayOptionChange(value, 'PROFILE_NAME'),
  },
  {
    label: 'Object Header',
    key: 'PROFILE_HEADER',
    value: !!displayOptionsState?.displayOptions?.find(
      (option) => option === 'PROFILE_HEADER',
    ),
    onChange: (value) => handleDisplayOptionChange(value, 'PROFILE_HEADER'),
  },
  ...commonOptions(displayOptionsState, handleDisplayOptionChange),
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
      let options = getAdditionalTaskOptions({
        displayOptionsState,
        handleDisplayOptionChange,
      });
      options = options.filter((opt) => opt.key !== DisplayOption.REQUIRED);
      return options;
    }

    case 'PROFILE': {
      return getAdditionalProfileOptions({
        displayOptionsState,
        handleDisplayOptionChange,
      });
    }

    case 'GLOBAL': {
      return [];
    }

    default: {
      return null;
    }
  }
};

export const regexValidator = () => {
  const INVALID_REGEX_MESSAGE =
    'Enter a valid regular expression (e.g. /^[a-z]+$/i)';

  return Yup.string()
    .nullable()
    .test('is-valid-regex', INVALID_REGEX_MESSAGE, (value) => {
      if (!value) return true;
      const match = value.match(/^\/(.+)\/([a-z]*)$/i);
      if (!match) return false;
      try {
        new RegExp(match[1], match[2]);
        return true;
      } catch {
        return false;
      }
    });
};
