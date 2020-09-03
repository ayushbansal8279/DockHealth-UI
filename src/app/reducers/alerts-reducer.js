/* eslint-disable sonarjs/no-small-switch */
const initialState = {
  alertsEnabled: false,
};

const AlertsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'alerts/enableAlerts': {
      const { alertsEnabled } = action;
      return { alertsEnabled };
    }

    default:
      return state;
  }
};

export default AlertsReducer;
