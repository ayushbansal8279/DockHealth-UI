// eslint-disable-next-line import/prefer-default-export
export const swithAlertsToastsHide = value => dispatch =>
  dispatch({
    type: 'alerts/alertToastsHide',
    alertToastHide: value,
  });
