import { createSelector } from 'reselect';

export const profileDetailsStateSelector = (state) => state.profileDetails;

export const profileAllTasksSelector = createSelector(
  profileDetailsStateSelector,
  (profileDetails) => Object.values(profileDetails.tasksMap),
);
export const profileTaskDetailsSelector = createSelector(
  profileDetailsStateSelector,
  (_, taskId) => taskId,
  (profileDetails, taskId) => profileDetails.tasksMap[taskId],
);
