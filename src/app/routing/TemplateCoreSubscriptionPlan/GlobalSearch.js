import { resetGlobalSearch } from 'actions/global-search-actions';

export const onLeaveGlobalSearch = ({ dispatch }) => {
  dispatch(resetGlobalSearch());
};
