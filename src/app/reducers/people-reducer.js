import * as types from 'actions/action-types';

const initialState = {
  peoplelist: [],
  isFetching: false,
  personData: null,
};

const PeopleReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_PEOPLE_SUCCESS:
      return {
        ...state,
        peoplelist: action.peoplelist ?? state.peoplelist,
        isFetching: false,
      };

    case types.REQUEST_PEOPLE:
      return {
        ...state,
        isFetching: true,
      };

    case types.GET_USER_AVATAR_SUCCESS:
      return {
        ...state,
        peoplelist: state.peoplelist.map(user =>
          user === action.user
            ? {
                ...user,
                avatar: action.avatar,
              }
            : user,
        ),
      };

    case types.GET_USER_DETAILS_SUCCESS:
      return {
        ...state,
        personData: action.user,
      };

    case types.GET_USER_DETAILS_FAILURE:
      return {
        ...state,
        personData: null,
      };

    default:
      return state;
  }
};

export default PeopleReducer;
