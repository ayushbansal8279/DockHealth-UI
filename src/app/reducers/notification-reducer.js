export function reducer (state = {message: false, type: false, hidden: true, stay: false}, action) {
  let newState
  switch (action.type) {
    case 'notification/info':
    case 'notification/success':
    case 'notification/error':
    case 'notification/default':
      return {
        hidden: false,
        message: action.message,
        type: action.type.replace('notification/', ''),
        stay: action.stay
      }
    case 'notification/hide':
      newState = Object.assign({}, state)
      newState.hidden = true
      return newState
    default:
      return state
  }
}
