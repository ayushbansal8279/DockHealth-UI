import {
  SHOW_GLOBAL_ALERT,
  SHOW_SIDEBAR_ALERT,
  CLOSE_GLOBAL_ALERT,
} from './reducer';
import AlertTypes from './AlertTypes';

export const showGlobalAlert = (text, type = AlertTypes.SUCCESS) => ({
  type: SHOW_GLOBAL_ALERT,
  payload: { text, type },
});

export const showSideBarAlert = (text, type = AlertTypes.SUCCESS) => ({
  type: SHOW_SIDEBAR_ALERT,
  payload: { text, type },
});

export const closeGlobalAlert = () => ({
  type: CLOSE_GLOBAL_ALERT,
});
