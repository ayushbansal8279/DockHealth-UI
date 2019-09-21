import * as types from '../actions/action-types';

const initialState = {
  peoplelist: [],
  isFetching: false,
};

const PeopleReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_PEOPLE_SUCCESS:
      return ({
        ...state,
        peoplelist: action.peoplelist,
        isFetching: false,
      });

    case types.REQUEST_PEOPLE:
      return ({
        ...state,
        isFetching: true,
      });

    case types.GET_USER_AVATAR_SUCCESS:
      return {
        ...state,
        peoplelist: state.peoplelist.map(user => (user === action.user
          ? {
            ...user,
            avatar: action.avatar,
          }
          : user)),
      };

    default:
      return state;
  }
};

export default PeopleReducer;
