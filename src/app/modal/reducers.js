export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

const INITIAL_STATE = { isOpen: false, modalProps: {}, modalName: null };

export default function(state = INITIAL_STATE, action = {}) {
  const { type, name, props = {} } = action;

  switch (type) {
    case OPEN_MODAL:
      return {
        isOpen: true,
        modalProps: props,
        modalName: name,
      };

    case CLOSE_MODAL:
      return INITIAL_STATE;
    default:
      return state;
  }
}
