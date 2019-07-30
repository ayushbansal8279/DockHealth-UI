import {
  GET_PATIENTS_SUCCESS,
  REQUEST_PATIENTS,
  GET_LIST_PATIENTS_SUCCESS,
  ADD_PATIENT_SUCCESS,
  UPDATE_PATIENT_SUCCESS,
  GET_PATIENT_SUCCESS,
  GET_EMR_PATIENTS_SUCCESS,
  SELECT_EMR_PATIENT_SUCCESS,
  HIGHLIGHT_PATIENT,
} from '../actions/action-types';

const initialState = {
  allPatients: [],
  highlightedPatientId: null,
  listPatients: [],
  selectedPatient: null,
  emrPatients: [],
  selectedEmrPatient: null,
};

const PatientReducer = (state = initialState, action) => {
  switch (action.type) {
    case HIGHLIGHT_PATIENT: {
      const { patientId } = action;
      return ({
        ...state,
        highlightedPatientId: patientId,
      });
    }

    case GET_PATIENTS_SUCCESS: {
      const { patients } = action;
      return ({
        ...state,
        allPatients: patients,
        isFetching: false,
      });
    }

    case REQUEST_PATIENTS: {
      return ({
        ...state,
        isFetching: true,
      });
    }

    case GET_LIST_PATIENTS_SUCCESS: {
      const { patients } = action;
      return ({ ...state, listPatients: patients });
    }

    case ADD_PATIENT_SUCCESS: {
      const { patient } = action;
      return ({ ...state, allPatients: [...state.allPatients, patient] });
    }

    case UPDATE_PATIENT_SUCCESS: {
      // const { patient } = action;
      return state; // TODO
    }

    case GET_PATIENT_SUCCESS: {
      const { patient } = action;
      return ({
        ...state,
        selectedPatient: patient,
      });
    }

    case GET_EMR_PATIENTS_SUCCESS: {
      const { patients } = action;
      return ({ ...state, emrPatients: patients });
    }

    case SELECT_EMR_PATIENT_SUCCESS: {
      const { patient } = action;
      return ({ ...state, selectedEmrPatient: patient, emrPatients: [] });
    }

    default:
      return state;
  }
};

export default PatientReducer;
