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

const initialState = {
  isHeaderVisible: true,
  isNavbarInFullMode: false,
  areNavbarSettingsVisible: true,
  navbarFullWidth: null,
};

const TemplateReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_TEMPLATE_HEADER:
      return { ...state, isHeaderVisible: true };

    case HIDE_TEMPLATE_HEADER:
      return { ...state, isHeaderVisible: false };

    case ENABLE_NAVBAR_FULL_MODE:
      return { ...state, isNavbarInFullMode: true };

    case DISABLE_NAVBAR_FULL_MODE:
      return { ...state, isNavbarInFullMode: false };

    case SHOW_NAVBAR_SETTINGS:
      return { ...state, areNavbarSettingsVisible: true };

    case HIDE_NAVBAR_SETTINGS:
      return { ...state, areNavbarSettingsVisible: false };

    case SET_CUSTOM_NAVBAR_FULL_WIDTH: {
      const { width } = action.payload;
      return { ...state, navbarFullWidth: width };
    }
    case RESET_CUSTOM_NAVBAR_FULL_WIDTH:
      return { ...state, navbarFullWidth: null };
    default: {
      return { ...state };
    }
  }
};

export default TemplateReducer;
