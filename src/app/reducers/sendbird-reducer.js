import * as ActionTypes from 'actions/action-types';

const initialState = {
  showPopover: false,
};

const SendbirdReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.OPEN_CHAT_POPOVER: {
      const {
        payload: { showPopover, channel },
      } = action;
      return { ...state, showPopover, channel };
    }
    case ActionTypes.CLOSE_CHAT_POPOVER: {
      const {
        payload: { channel },
      } = action;
      return { ...state, showPopover: false, channel };
    }
    case ActionTypes.CHAT_SELECT_CHANNEL: {
      const {
        payload: { channel },
      } = action;
      return { ...state, channel };
    }
    default:
      return state;
  }
};

export default SendbirdReducer;
