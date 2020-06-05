export const SET_LOCATION_PARAMS = 'SET_LOCATION_PARAMS';

const initialState = {
  location: {},
  params: {},
};

const TaskGroupListReducer = (
  state = initialState,
  { type, location, params },
) => {
  if (type === SET_LOCATION_PARAMS) {
    return { location, params };
  }

  return state;
};

export default TaskGroupListReducer;
