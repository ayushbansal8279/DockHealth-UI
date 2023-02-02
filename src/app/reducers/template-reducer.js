import {
  SHOW_NAVBAR,
  HIDE_NAVBAR,
  SHOW_SUB_MENU,
  HIDE_SUB_MENU,
  OPEN_NOTIFICATIONS,
  CLEAR_NOTIFICATIONS,
} from 'actions/action-types';

const initialState = {
  isNavbarVisible: true,
  subMenuKey: null,
  notificationsOpen: false,
  notificationsPage: '',
};

const TemplateReducer = (state = initialState, action) => {
  switch (action.type) {
    case HIDE_NAVBAR: {
      return { ...state, isNavbarVisible: false };
    }

    case SHOW_NAVBAR: {
      return { ...state, isNavbarVisible: true };
    }

    case SHOW_SUB_MENU: {
      return { ...state, subMenuKey: action.subMenuKey };
    }

    case HIDE_SUB_MENU: {
      return { ...state, subMenuKey: null };
    }

    case OPEN_NOTIFICATIONS: {
      return {
        ...state,
        notificationsOpen: true,
        notificationsPage: action.notificationsPage,
      };
    }

    case CLEAR_NOTIFICATIONS: {
      return { ...state, notificationsOpen: false, notificationsPage: '' };
    }

    default: {
      return state;
    }
  }
};

export default TemplateReducer;
