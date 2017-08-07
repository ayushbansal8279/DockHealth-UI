import * as ActionTypes from '../actions/action-types';
import * as PatientApi from '../api/patient-api'

export function getAllPatients() {
  return function(dispatch) {
    return PatientApi.getAllPatients().then(patients => {
      dispatch(getAllPatientsSuccess(patients));
      loading()
    }).catch(error => {
      throw(error);
    });
  };
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
    return PatientApi.getPatientById(patientId).then(patient => {
      dispatch({type: ActionTypes.GET_PATIENT_SUCCESS, patient})
    }).catch(error => {
      throw(error)
    })
  }
}

export function getAllPatientsSuccess(patients) {
  return {type: ActionTypes.GET_PATIENTS_SUCCESS, patients};
}

export function addPatient(newPatient) {
  return function(dispatch){
    return PatientApi.addPatient(newPatient).then(patient => {
      dispatch({type: ActionTypes.ADD_PATIENT_SUCCESS, patient});
    }).catch(error => {
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
      throw(error)
    })
  }
}

export function lookupEMRPatients(searchToken){
  return function(dispatch){
    return PatientApi.lookupEMRPatients(searchToken).then(patients => {
      dispatch({type: ActionTypes.GET_EMR_PATIENTS_SUCCESS, patients})
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
