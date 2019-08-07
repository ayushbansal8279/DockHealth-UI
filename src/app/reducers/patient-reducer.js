import * as types from '../actions/action-types';
import initialState from './initialState';

const PatientReducer = function(state = {allPatients: [], listPatients: [], selectedPatient: null, emrPatients: [], selectedEmrPatient: null}, action) {

  switch(action.type) {

    case types.GET_PATIENTS_SUCCESS:
      return Object.assign({}, state, { allPatients: action.patients, isFetching: false });

    case types.REQUEST_PATIENTS:
      return Object.assign({}, state, { isFetching:true })

    case types.GET_LIST_PATIENTS_SUCCESS:
      return Object.assign({}, state, { listPatients: action.patients });

    case types.ADD_PATIENT_SUCCESS:
      return Object.assign({}, state, {allPatients: state.allPatients.concat([action.patient])});

    case types.UPDATE_PATIENT_SUCCESS:
      //return Object.assign({}, state, {tasks: state.allPatients.concat([action.patient])});

    case types.GET_PATIENT_SUCCESS:
      return Object.assign({}, state, {selectedPatient: action.patient});
      //return {...state, selectedPatient: action.patient};

    case types.REQUEST_EMR_PATIENTS:
      return Object.assign({}, state, { emrPatients: [], isFetching:true })

    case types.CLEAR_EMR_PATIENTS:
      return Object.assign({}, state, { emrPatients: [] })

    case types.GET_EMR_PATIENTS_SUCCESS:
      return Object.assign({}, state, { emrPatients: action.patients, isFetching: false });

    case types.SELECT_EMR_PATIENT_SUCCESS:
      return Object.assign({}, state, { selectedEmrPatient: action.patient, emrPatients: [] });

  }

  return state;

}

export default PatientReducer
