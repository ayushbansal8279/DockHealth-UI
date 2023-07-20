import {
  SHOW_NAVBAR,
  HIDE_NAVBAR,
  SHOW_SUB_MENU,
  HIDE_SUB_MENU,
  OPEN_NOTIFICATIONS,
  CLEAR_NOTIFICATIONS,
} from 'actions/action-types';

export const showNavbar = () => ({
  type: SHOW_NAVBAR,
});

export const hideNavbar = () => ({
  type: HIDE_NAVBAR,
});

export const showSubMenu = (subMenuKey) => ({
  type: SHOW_SUB_MENU,
  subMenuKey,
});

export const hideSubMenu = () => ({
  type: HIDE_SUB_MENU,
});

export const openNotifications = (notificationsPage) => ({
  type: OPEN_NOTIFICATIONS,
  notificationsPage,
});

export const clearNotifications = () => ({
  type: CLEAR_NOTIFICATIONS,
});
