import { getTaskListForUser } from 'actions/tasklist-actions';
import { findPendingTaskListsForUser } from 'actions/invitation-actions';

const onEnterTemplateCoreSubscriptionPlan = async ({ dispatch }) => {
  await dispatch(getTaskListForUser());
  await dispatch(findPendingTaskListsForUser());
};

export default onEnterTemplateCoreSubscriptionPlan;
