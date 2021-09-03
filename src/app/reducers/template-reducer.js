import { omit } from 'ramda';
import {
  SHOW_TEMPLATE_HEADER,
  HIDE_TEMPLATE_HEADER,
  SHOW_NAVBAR,
  HIDE_NAVBAR,
  SHOW_SUB_MENU,
  HIDE_SUB_MENU,
  OPEN_NOTIFICATIONS,
  CLEAR_NOTIFICATIONS,
  HIDE_HEADER,
  SET_HEADER,
  UNSET_HEADER,
} from 'actions/action-types';
import palette from 'styles/palette';

const initialHeaderState = {
  show: false,
  backgroundColor: palette.white,
  latout: [],
};

const initialState = {
  isHeaderVisible: true,
  isNavbarVisible: true,
  subMenuKey: null,
  notificationsOpen: false,
  notificationsPage: '',
  header: initialHeaderState,
};

const TemplateReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_TEMPLATE_HEADER:
      return { ...state, isHeaderVisible: true };

    case HIDE_TEMPLATE_HEADER:
      return { ...state, isHeaderVisible: false };

    case HIDE_NAVBAR:
      return { ...state, isNavbarVisible: false };

    case SHOW_NAVBAR:
      return { ...state, isNavbarVisible: true };

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

    case SET_HEADER: {
      const headerData = action?.headerData ?? {};

      return {
        ...state,
        isHeaderVisible: true,
        header: {
          ...initialHeaderState,
          show: true,
          ...headerData,
        },
      };
    }

    case UNSET_HEADER: {
      const headerData = action?.headerData ?? {};

      return {
        ...state,
        header: {
          ...state.header,
          ...omit(['show'], headerData),
        },
      };
    }

    case HIDE_HEADER:
      return {
        ...state,
        header: {
          ...state.header,
          show: false,
        },
      };

    default: {
      return { ...state };
    }
  }
};

export default TemplateReducer;
