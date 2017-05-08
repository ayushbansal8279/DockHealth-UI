import * as types from '../actions/action-types';
import initialState from './initialState';

const PatientReducer = function(state = {allPatients: []}, action) {

  switch(action.type) {

    case types.GET_PATIENTS_SUCCESS:
      return Object.assign({}, state, { allPatients: action.patients });

    case types.ADD_PATIENT_SUCCESS:
      return Object.assign({}, state, {tasks: state.allPatients.concat([action.patient])});

    case types.ADD_PATIENT_TO_TASK_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.taskId === action.taskId ?
            // transform the one with a matching id
            { ...task, patient: action.patient } :
            // otherwise return original task
            task
        )
      };

  }

  return state;

}

export default PatientReducer
