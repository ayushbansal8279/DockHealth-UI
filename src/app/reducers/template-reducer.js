import {
  SHOW_TEMPLATE_HEADER,
  HIDE_TEMPLATE_HEADER,
} from 'actions/action-types';

const initialState = {
  isHeaderVisible: true,
};

const TemplateReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_TEMPLATE_HEADER:
      return { ...state, isHeaderVisible: true };

    case HIDE_TEMPLATE_HEADER:
      return { ...state, isHeaderVisible: false };

    default: {
      return { ...state };
    }
  }
};

export default TemplateReducer;
