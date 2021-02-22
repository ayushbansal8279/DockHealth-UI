import { getTaskListForUser } from 'actions/task-list-actions';
import { findPendingTaskListsForUser } from 'actions/invitation-actions';

const onEnterTemplateCoreSubscriptionPlan = async ({ dispatch }) => {
  await dispatch(getTaskListForUser());
  await dispatch(findPendingTaskListsForUser());
};

export default onEnterTemplateCoreSubscriptionPlan;
