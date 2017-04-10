
export function reducer (state = {user: false}, action) {
  let newState
  switch (action.type) {
    // trigger when user is changed
    case 'user/user':
      newState = Object.assign({}, state)
      newState.user = action.user
      return newState
    default:
      return state
  }
}
