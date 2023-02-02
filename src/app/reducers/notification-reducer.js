const initialState = {
  message: false,
  type: false,
  hidden: true,
  stay: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'notification/info':
    case 'notification/success':
    case 'notification/error':
    case 'notification/default': {
      return {
        hidden: false,
        message: action.message,
        type: action.type.replace('notification/', ''),
        stay: action.stay,
      };
    }

    case 'notification/hide': {
      return { ...state, hidden: true };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
