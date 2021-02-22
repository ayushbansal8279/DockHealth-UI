import * as TaskListActions from 'actions/task-list-actions';

const onEnterTemplateCoreSubscriptionPlan = async ({ dispatch }) => {
  await dispatch(TaskListActions.getTaskListForUser());
  await dispatch(TaskListActions.getPendingTaskListsForUser());
};

export default onEnterTemplateCoreSubscriptionPlan;
