import * as ActionTypes from '../actions/action-types';

export function notification (message, type, stay) {
  return function(dispatch) {
    // return new Promise(resolve => {
      dispatch({type: `notification/${type || 'default'}`, message: message, stay: Boolean(stay)})
      if (!stay) {
        setTimeout(() => {
          dispatch({type: 'notification/hide'})
        }, 4000)
      }
    // })
  }
}

export function success (message, stay) {
  //alert(message);
  return notification(message, 'success', stay)
}

export function error (message, stay) {
  alert(message);
  return notification(message, 'error', stay)
}
 
export function hide (message, stay) {
  return notification(message, 'hide', stay)
}