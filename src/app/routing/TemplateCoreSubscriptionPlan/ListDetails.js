import { onEnterListDetails } from 'sagas/list-details-saga';
import { getMembersByTaskListId } from 'actions/task-list-actions';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import * as ListDetailsActions from 'actions/list-details-actions';
import * as TaskActions from 'actions/task-actions';
import * as TaskDrawerActions from 'actions/task-drawer-actions';

export const onEnterListDetailsView = ({ match, dispatch }) => {
  const { params } = match;
  if (params?.taskIdentifier) {
    dispatch(
      TaskActions.refreshAndOpenAsCurrentTask({
        taskIdentifier: params?.taskIdentifier,
      }),
    );
  }
  if (params?.taskListIdentifier) {
    dispatch(onEnterListDetails());
    dispatch(getMembersByTaskListId(params?.taskListIdentifier, 'ALL'));
  }
};

export const onLeaveListDetailsView = ({ dispatch }) => {
  dispatch(MegaFilterActions.clearFiltersForMegaFilter());
  dispatch(ListDetailsActions.resetListDetailsTaskCounters());
  dispatch(ListDetailsActions.setListDetailsTasksSort(null, null));
  dispatch(TaskDrawerActions.closeDrawer());
  dispatch(TaskActions.storeAsCurrentTask(null));
};
