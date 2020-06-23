import {
  SHOW_TEMPLATE_HEADER,
  HIDE_TEMPLATE_HEADER,
  ENABLE_NAVBAR_FULL_MODE,
  DISABLE_NAVBAR_FULL_MODE,
  SHOW_NAVBAR_SETTINGS,
  HIDE_NAVBAR_SETTINGS,
  SET_CUSTOM_NAVBAR_FULL_WIDTH,
  RESET_CUSTOM_NAVBAR_FULL_WIDTH,
} from 'actions/action-types';

export const hideHeader = () => ({
  type: HIDE_TEMPLATE_HEADER,
});

export const showHeader = () => ({
  type: SHOW_TEMPLATE_HEADER,
});

export const hideNavbarSettings = () => ({
  type: HIDE_NAVBAR_SETTINGS,
});

export const showNavbarSettings = () => ({
  type: SHOW_NAVBAR_SETTINGS,
});

export const enableNavbarFullMode = () => ({
  type: ENABLE_NAVBAR_FULL_MODE,
});

export const disableNavbarFullMode = () => ({
  type: DISABLE_NAVBAR_FULL_MODE,
});

export const setCustomNavbarWidth = width => ({
  type: SET_CUSTOM_NAVBAR_FULL_WIDTH,
  payload: {
    width,
  },
});

export const resetCustomNavbarWidth = () => ({
  type: RESET_CUSTOM_NAVBAR_FULL_WIDTH,
});
