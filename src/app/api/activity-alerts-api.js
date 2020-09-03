import axios from './axios-heydoc';

export const getActivityAlertsPreferences = () =>
  axios({
    method: 'get',
    url: '/activity/overview',
  })
    .then(({ data }) => {
      const { notificationsEnabled, hasUnreadAlerts } = data;
      sessionStorage.setItem('notificationsEnabled', notificationsEnabled);
      sessionStorage.setItem('hasUnreadAlerts', hasUnreadAlerts);
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

export const clearActivityAlert = (activityAlertId, onSuccess) =>
  axios({
    method: 'put',
    url: `/activity/clear/${activityAlertId}`,
  })
    .then(() => {
      onSuccess();
    })
    .catch(error => {
      throw error;
    });

export const clearAllActivityAlerts = onSuccess =>
  axios({
    method: 'put',
    url: '/activity/clearAllActivityAlertsForUser',
  })
    .then(() => {
      onSuccess();
    })
    .catch(error => {
      throw error;
    });

export const switchActivityAlerts = value =>
  axios({
    method: 'put',
    url: `/activity/notifications?enable=${value}`,
  })
    .then(() => {
      sessionStorage.setItem('notificationsEnabled', value);
    })
    .catch(error => {
      throw error;
    });
