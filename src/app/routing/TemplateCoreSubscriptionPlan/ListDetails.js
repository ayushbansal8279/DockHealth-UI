import { onEnterListDetails } from 'sagas/list-details-saga';
import { getMembersByTaskListId } from 'actions/tasklist-actions';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import * as ListDetailsActions from 'actions/list-details-actions';
import * as TaskActions from 'actions/task-actions';
import * as TaskDrawerActions from 'actions/task-drawer-actions';
import { TaskStatus } from 'helpers/task-helpers';

export const onEnterListDetailsView = ({ match, dispatch }) => {
  const { params } = match;
  if (params?.taskListIdentifier) {
    dispatch(onEnterListDetails());
    dispatch(getMembersByTaskListId(params?.taskListIdentifier, 'ALL'));

    const status =
      params?.tabName?.toLowerCase() === 'complete'
        ? TaskStatus.COMPLETE
        : TaskStatus.INCOMPLETE;
    dispatch(
      MegaFilterActions.getFiltersForMegaFilter(
        params?.taskListIdentifier,
        status,
      ),
    );
    dispatch(
      ListDetailsActions.getListDetailsTaskCounters(params.taskListIdentifier),
    );
    dispatch(
      ListDetailsActions.getListDetailsGroupedTasks({
        taskListIdentifier: params.taskListIdentifier,
        status,
      }),
    );
  }
};

export const onLeaveListDetailsView = ({ dispatch }) => {
  dispatch(MegaFilterActions.clearFiltersForMegaFilter());
  dispatch(ListDetailsActions.resetListDetailsTaskCounters());
  dispatch(ListDetailsActions.setListDetailsTasksSort(null, null));
  dispatch(TaskDrawerActions.closeDrawer());
  dispatch(TaskActions.storeAsCurrentTask(null));
};
