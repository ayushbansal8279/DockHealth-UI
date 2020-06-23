import {} from 'actions/action-types';

const SHOW_TEMPLATE_HEADER = 'SHOW_TEMPLATE_HEADER';
const HIDE_TEMPLATE_HEADER = 'HIDE_TEMPLATE_HEADER';

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
