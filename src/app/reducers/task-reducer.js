import * as types from '../actions/action-types';
/*
const task = (state = {}, action) => {
  switch (action.type) {
    case types.GET_TASKS:
      return {
        id: action.id,
        text: action.text,
        completed: false
      }
    case 'TOGGLE_TASK':
      if (state.id !== action.id) {
        return state
      }

      return Object.assign({}, state, {
        completed: !state.completed
      })

    default:
      return state
  }
}
*/

/*
const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ]
    case 'TOGGLE_TODO':
      return state.map(t =>
        todo(t, action)
      )
    default:
      return state
  }
}
*/


const initialState = {
  tasks: []
};

const TaskReducer = function(state = initialState, action) {

  switch(action.type) {    
    // case types.ADD_TASK:
    //   return [
    //     ...state,
    //     todo(undefined, action)
    //   ]

    case 'TOGGLE_TODO':
      return state.map(t =>
        todo(t, action)
      )

    case types.ADD_TASK:
      // return {
      //   id: action.id,
      //   task: action.task,
      //   completed: false
      // }
      //var newState = state.tasks.concat([action.task]); // make a copy of the array, and then we'll change and return the copy
      //return newState;
      //action.task.id = action.id
      return Object.assign({}, state, {tasks: state.tasks.concat([action.task])});

    case types.GET_TASKS_SUCCESS:
      return Object.assign({}, state, { tasks: action.tasks });
/*
    case types.DELETE_USER_SUCCESS:
      // Use lodash to create a new user array without the user we want to remove
      const newUsers = _.filter(state.users, user => user.id != action.userId);
      return Object.assign({}, state, { users: newUsers });
*/
/*
    case types.USER_PROFILE_SUCCESS:
      return Object.assign({}, state, { userProfile: action.userProfile });
*/
  }

  return state;

}

export default TaskReducer
