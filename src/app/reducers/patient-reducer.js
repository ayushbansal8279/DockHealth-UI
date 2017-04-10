import * as types from '../actions/action-types';

const initialState = {
  allPatients: []
};

const PatientReducer = function(state = initialState, action) {

  switch(action.type) {  

    case types.ADD_PATIENT:
      return Object.assign({}, state, {tasks: state.allPatients.concat([action.patient])});

    case types.GET_PATIENTS_SUCCESS:
      return Object.assign({}, state, { allPatients: action.patients });

  }

  return state;

}

export default PatientReducer
