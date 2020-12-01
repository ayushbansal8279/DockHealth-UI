import { resetGlobalSearch } from 'actions/global-search-actions';
import { closeDrawer } from 'actions/task-drawer-actions';
import { setHeader } from 'actions/header-actions';

export const onEnterGlobalSearch = ({ dispatch }) => {
  setHeader(dispatch)({
    layout: [
      {
        key: '',
        component: null,
      },
    ],
  });
};

export const onLeaveGlobalSearch = ({ dispatch }) => {
  dispatch(resetGlobalSearch());
  dispatch(closeDrawer());
};
