/* eslint-disable react-hooks/rules-of-hooks */
import { useFormContext } from 'react-hook-form';

import palette from 'styles/palette';

export const STATUSES = [
  {
    value: 'PLANNED',
    label: 'Planned',
    color: palette.brightBlue,
  },
  {
    value: 'IN_PROGRESS',
    label: 'In progress',
    color: palette.keyLimePie,
  },
  {
    value: 'WAITING',
    label: 'Waiting',
    color: palette.coolGrey2,
  },
  {
    value: 'ON_HOLD',
    label: 'On hold',
    color: palette.mediumGrey,
  },
];

const initializeStatusSectionHooks = () => {
  const { watch } = useFormContext();
  const currentValue = watch('workflowStatus');

  return {
    currentStatusFlagColor: STATUSES.find(({ value }) => value === currentValue)
      ?.color,
  };
};

export default initializeStatusSectionHooks;
