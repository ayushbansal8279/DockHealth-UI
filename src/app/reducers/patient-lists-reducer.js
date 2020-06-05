import { SET_ACTIVE_TAB } from 'actions/action-types';

const INITIAL_STATE = {
  activeTab: null,
};

export default function(state = INITIAL_STATE, action = {}) {
  const { type, payload } = action;

  // eslint-disable-next-line sonarjs/no-small-switch
  switch (type) {
    case SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: payload?.activeTab,
      };
    default:
      return state;
  }
}
