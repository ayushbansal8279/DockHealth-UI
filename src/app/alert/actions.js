import {
  SHOW_GLOBAL_ALERT,
  SHOW_SIDEBAR_ALERT,
  CLOSE_GLOBAL_ALERT,
} from './reducer';
import AlertTypes from './AlertTypes';

const DEFAULT_ERROR_TEXT = 'Something went wrong. Try again.';

export const showGlobalAlert = (text, type = AlertTypes.SUCCESS) => ({
  type: SHOW_GLOBAL_ALERT,
  payload: { text, type },
});

export const showGlobalAlertWithUndo = (text, transactionId, undoCallback) => ({
  type: SHOW_GLOBAL_ALERT,
  payload: { text, transactionId, undoCallback, type: AlertTypes.SUCCESS },
});

export const showGlobalErrorAlert = (text = DEFAULT_ERROR_TEXT) => ({
  type: SHOW_GLOBAL_ALERT,
  payload: { text, type: AlertTypes.ERROR },
});

export const showSideBarAlert = (text, type = AlertTypes.SUCCESS) => ({
  type: SHOW_SIDEBAR_ALERT,
  payload: { text, type },
});

export const closeGlobalAlert = () => ({
  type: CLOSE_GLOBAL_ALERT,
});
