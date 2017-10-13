import * as ActionTypes from '../actions/action-types';
import * as PatientApi from '../api/patient-api'
import {reset} from 'redux-form';

export function getAllPatients() {
  return function(dispatch) {
    return PatientApi.getAllPatients().then(patients => {
      dispatch(getAllPatientsSuccess(patients));
      // loading()
    }).catch(error => {
      throw(error);
    });
  };
}

export function loading(){
  return function(dispatch){
    dispatch({type: ActionTypes.REQUEST_PATIENTS})
  }
}

export function getPatientsByTaskList(taskListId){
  return function(dispatch){
    return PatientApi.getPatientsByTaskList(taskListId).then(patients => {
      dispatch({type: ActionTypes.GET_LIST_PATIENTS_SUCCESS, patients})
    }).catch(error => {
      throw(error)
    })
  }
}

export function getPatientById(patientId){
  return function(dispatch){
    if(!patientId){
      var patient = null;
      dispatch({type: ActionTypes.GET_PATIENT_SUCCESS, patient});
    }
    return PatientApi.getPatientById(patientId).then(patient => {
      dispatch({type: ActionTypes.GET_PATIENT_SUCCESS, patient})
    }).catch(error => {
      throw(error)
    })
  }
}

export function patientToState(patient){
  return function(dispatch){
    dispatch({type: ActionTypes.GET_PATIENT_SUCCESS, patient})
    // dispatch({type: ActionTypes.PATIENT_SELECTION_RESET, patient})
    // dispatch(reset('FormPatient'));
  }
}

export function getAllPatientsSuccess(patients) {
  return {type: ActionTypes.GET_PATIENTS_SUCCESS, patients};
}

export function addPatient(newPatient) {
  return function(dispatch){
    return PatientApi.addPatient(newPatient).then(patient => {
      dispatch({type: ActionTypes.ADD_PATIENT_SUCCESS, patient});
      return patient
    }).catch(error => {
      toggleAlert(error.message, "error")
      throw(error);
    });
  };
}

export function updatePatient(newPatient) {
  return function(dispatch){
    return PatientApi.updatePatient(newPatient).then(patient => {
      dispatch({type: ActionTypes.UPDATE_PATIENT_SUCCESS, patient});
      toggleAlert("Patient updated successfully!", "success")
    }).catch(error => {
      toggleAlert(error.message, "error")
      throw(error);
    });
  };
}

export function addPatientToTask(patientId, taskId){
  return function(dispatch){
    return PatientApi.addPatientToTask(patientId, taskId).then(patient => {
      dispatch({type: ActionTypes.ADD_PATIENT_TO_TASK_SUCCESS, patient, taskId})
      toggleAlert("Patient added successfully!", "success")
    }).catch(error => {
      toggleAlert(error.message, "error")
      throw(error)
    })
  }
}

export function lookupEMRPatients(searchToken){
  return function(dispatch){
    return PatientApi.lookupEMRPatients(searchToken).then(patients => {
      dispatch({type: ActionTypes.GET_EMR_PATIENTS_SUCCESS, patients})
      // var patient = null
      // dispatch({type: ActionTypes.PATIENT_SELECTION_RESET, patient})
    }).catch(error => {
      throw(error)
    })
  }
}

export function selectEMRPatient(patient){
  return function(dispatch){
      dispatch({type: ActionTypes.SELECT_EMR_PATIENT_SUCCESS, patient})
  }
}

export function deletePatient(patientId){
  return function(dispatch){
    return PatientApi.deletePatient(patientId).then(res => {
      dispatch({type: ActionTypes.DELETE_PATIENT_SUCCESS, patientId})
    }).catch(error => {
      throw(error)
    })
  }
}
