import {
  getFiltersForPeopleListMegaFilter,
  clearFiltersForMegaFilter,
} from 'actions/mega-filter-actions';
import { TaskListTabName } from 'helpers/tasklist-helpers';
import { closeDrawer } from 'actions/task-drawer-actions';

export const onEnterPersonDetails = ({ dispatch, match }) => {
  const { params } = match;

  if (params?.userIdentifier) {
    dispatch(
      getFiltersForPeopleListMegaFilter(
        params?.userIdentifier,
        params?.tabName === TaskListTabName.COMPLETE
          ? 'COMPLETE'
          : 'INCOMPLETE',
      ),
    );
  }
};

export const onLeavePersonDetails = ({ dispatch }) => {
  dispatch(clearFiltersForMegaFilter());
  dispatch(closeDrawer());
};
