import { useSelector } from 'react-redux';
import { getSubtaskQuickAddOpenState } from 'selectors/ui-state-selectors';

export const useSubtaskQuickAddState = (taskIdentifier) => {
  return useSelector((state) => getSubtaskQuickAddOpenState(state, taskIdentifier));
};
