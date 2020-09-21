/* eslint-disable sonarjs/no-small-switch */
const initialState = {
  alertsEnabled: false,
  alertToastHide: false,
};

const AlertsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'alerts/enableAlerts': {
      const { alertsEnabled } = action;
      return { ...state, alertsEnabled };
    }
    case 'alerts/alertToastsHide': {
      const { alertToastHide } = action;
      return { ...state, alertToastHide };
    }

    default:
      return state;
  }
};

export default AlertsReducer;
