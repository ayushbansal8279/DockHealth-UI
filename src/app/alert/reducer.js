export const SHOW_GLOBAL_ALERT = 'SHOW_GLOBAL_ALERT';
export const CLOSE_GLOBAL_ALERT = 'CLOSE_GLOBAL_ALERT';

const initialState = { isGlobalOpen: false, text: '' };

export default function(state = initialState, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case SHOW_GLOBAL_ALERT:
      return {
        ...state,
        text: payload.text,
        isGlobalOpen: true,
        type: payload.type,
      };

    case CLOSE_GLOBAL_ALERT:
      return {
        ...state,
        isGlobalOpen: false,
        type: '',
      };

    default:
      return state;
  }
}
