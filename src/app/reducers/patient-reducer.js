import * as types from '../actions/action-types';
import initialState from './initialState';

const PatientReducer = function(state = {allPatients: [], listPatients: [], selectedPatient: null}, action) {

  switch(action.type) {

    case types.GET_PATIENTS_SUCCESS:
      return Object.assign({}, state, { allPatients: action.patients });

    case types.GET_LIST_PATIENTS_SUCCESS:
      return Object.assign({}, state, { listPatients: action.patients });

    case types.ADD_PATIENT_SUCCESS:
      return Object.assign({}, state, {allPatients: state.allPatients.concat([action.patient])});

    case types.UPDATE_PATIENT_SUCCESS:
      //return Object.assign({}, state, {tasks: state.allPatients.concat([action.patient])});

    case types.GET_PATIENT_SUCCESS:
      return Object.assign({}, state, {selectedPatient: action.patient});
      //return {...state, selectedPatient: action.patient};

  }

  return state;

}

export default PatientReducer
