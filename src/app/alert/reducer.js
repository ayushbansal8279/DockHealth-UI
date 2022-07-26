export const SHOW_GLOBAL_ALERT = 'SHOW_GLOBAL_ALERT';
export const CLOSE_GLOBAL_ALERT = 'CLOSE_GLOBAL_ALERT';
export const SHOW_SIDEBAR_ALERT = 'SHOW_SIDEBAR_ALERT';

const initialState = {
  isGlobalOpen: false,
  text: '',
  transactionIdentifier: null,
  undoCallback: null,
};

export default function(state = initialState, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case SHOW_GLOBAL_ALERT:
      return {
        ...state,
        text: payload.text,
        isGlobalOpen: true,
        isSideBarAlert: false,
        type: payload.type,
        transactionIdentifier: payload.transactionIdentifier,
        undoCallback: payload.undoCallback,
        options: payload.options,
      };

    case SHOW_SIDEBAR_ALERT:
      return {
        ...state,
        text: payload.text,
        isGlobalOpen: true,
        isSideBarAlert: true,
        type: payload.type,
      };

    case CLOSE_GLOBAL_ALERT:
      return {
        ...state,
        isGlobalOpen: false,
        type: '',
        transactionIdentifier: null,
        undoCallback: null,
      };

    default:
      return state;
  }
}
