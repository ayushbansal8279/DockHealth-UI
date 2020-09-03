import axios from './axios-heydoc';
import configureStore from '../ConfigureStore';

const store = configureStore();

export const getActivityAlertsPreferences = () =>
  axios({
    method: 'get',
    url: '/activity/overview',
  })
    .then(({ data }) => {
      const { notificationsEnabled, hasUnreadAlerts } = data;
      sessionStorage.setItem('notificationsEnabled', notificationsEnabled);
      sessionStorage.setItem('hasUnreadAlerts', hasUnreadAlerts);
      store.dispatch({
        type: 'alerts/enableAlerts',
        alertsEnabled: notificationsEnabled,
      });
    })
    .catch(error => {
      throw error;
    });

export const getActivityAlerts = setActivityAlertsList =>
  axios({
    method: 'get',
    url: '/activity/findActivityAlertsForUser',
  })
    .then(({ data }) => {
      setActivityAlertsList(data);
      sessionStorage.setItem('hasUnreadAlerts', false);
    })
    .catch(error => {
      throw error;
    });

export const clearActivityAlert = activityAlertId =>
  axios({
    method: 'put',
    url: `/activity/clear/${activityAlertId}`,
  });

export const clearAllActivityAlerts = () =>
  axios({
    method: 'put',
    url: '/activity/clearAllActivityAlertsForUser',
  });

export const switchActivityAlerts = value =>
  axios({
    method: 'put',
    url: `/activity/notifications?enable=${value}`,
  })
    .then(() => {
      sessionStorage.setItem('notificationsEnabled', value);
      store.dispatch({
        type: 'alerts/enableAlerts',
        alertsEnabled: value,
      });
    })
    .catch(error => {
      throw error;
    });
