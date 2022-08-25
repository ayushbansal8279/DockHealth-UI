import * as ActionTypes from 'actions/action-types';

export function openPopover(channel) {
  return {
    type: ActionTypes.OPEN_CHAT_POPOVER,
    payload: { showPopover: true, channel },
  };
}

export function closePopover(channel = null) {
  return {
    type: ActionTypes.CLOSE_CHAT_POPOVER,
    payload: { showPopover: false, channel },
  };
}

export function selectChannel(channel = null) {
  return {
    type: ActionTypes.CHAT_SELECT_CHANNEL,
    payload: { channel },
  };
}
