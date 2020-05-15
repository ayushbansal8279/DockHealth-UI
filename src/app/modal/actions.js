import { OPEN_MODAL, CLOSE_MODAL } from './reducers';

export const openModal = (name, props = {}) => ({
  type: OPEN_MODAL,
  name,
  props,
});

export const closeModal = () => ({
  type: CLOSE_MODAL,
});
