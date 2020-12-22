import { onEnterListDetails } from 'sagas/list-details-saga';
import { getMembersByTaskListId } from 'actions/tasklist-actions';
import {
  getFiltersForMegaFilter,
  clearFiltersForMegaFilter,
} from 'actions/mega-filter-actions';
import { closeDrawer } from 'actions/task-drawer-actions';
import { storeAsCurrentTask } from 'actions/task-actions';
import { TaskListTabName } from 'components/taskView/Toolbar/config';

export const onEnterListDetailsView = ({ match, dispatch }) => {
  const { params } = match;
  if (params?.taskListIdentifier) {
    dispatch(onEnterListDetails());
    dispatch(getMembersByTaskListId(params?.taskListIdentifier, 'ALL'));

    dispatch(
      getFiltersForMegaFilter(
        params?.taskListIdentifier,
        params?.tabName === TaskListTabName.COMPLETE
          ? 'COMPLETE'
          : 'INCOMPLETE',
      ),
    );
  }
};

export const onLeaveListDetailsView = ({ dispatch }) => {
  dispatch(clearFiltersForMegaFilter());
  dispatch(closeDrawer());
  dispatch(storeAsCurrentTask(null));
};
