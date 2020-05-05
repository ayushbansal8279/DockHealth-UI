/* eslint-disable react-hooks/rules-of-hooks */
import { useFormContext } from 'react-hook-form';

import palette from 'styles/palette';

export const PRIORITIES = [
  {
    value: 'NONE',
    label: 'No priority',
    color: 'transparent',
  },
  {
    value: 'HIGH',
    label: 'High',
    color: palette.tomatoInYoFace,
  },
];

const initializePrioritySectionHooks = () => {
  const { watch } = useFormContext();
  const currentValue = watch('priority');

  return {
    currentPriorityFlagColor: PRIORITIES.find(
      ({ value }) => value === currentValue,
    )?.color,
  };
};

export default initializePrioritySectionHooks;
