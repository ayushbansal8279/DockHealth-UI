import { SET_ACTIVE_TAB } from './action-types';

export const setActiveTab = activeTab => ({
  type: SET_ACTIVE_TAB,
  payload: { activeTab },
});

export default { setActiveTab };
