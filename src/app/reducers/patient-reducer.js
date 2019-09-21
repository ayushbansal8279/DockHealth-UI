import {
  reject, map, lensProp, over, propEq, when, append, set,
} from 'ramda';
import {
  GET_PATIENTS_SUCCESS,
  REQUEST_PATIENTS,
  GET_LIST_PATIENTS_SUCCESS,
  ADD_PATIENT_SUCCESS,
  UPDATE_PATIENT_SUCCESS,
  GET_PATIENT_SUCCESS,
  GET_EMR_PATIENTS_SUCCESS,
  SELECT_EMR_PATIENT_SUCCESS,
  REQUEST_EMR_PATIENTS,
  CLEAR_EMR_PATIENTS,
  HIGHLIGHT_PATIENT,
  BEGIN_PATIENT_CREATION,
  ABORT_PATIENT_CREATION,
  ADD_PATIENT_ERROR,
  ADD_PATIENT_NOTE, UPDATE_PATIENT_NOTE, DELETE_PATIENT_NOTE,
} from '../actions/action-types';

const initialState = {
  allPatients: [],
  highlightedPatientId: null,
  listPatients: [],
  selectedPatient: null,
  emrPatients: [],
  selectedEmrPatient: null,
  isCreatingPatient: false,
};

const PatientReducer = (state = initialState, action) => {
  switch (action.type) {
    case BEGIN_PATIENT_CREATION: {
      return ({
        ...state,
        isCreatingPatient: true,
        highlightedPatientId: null,
      });
    }

    case ABORT_PATIENT_CREATION: {
      return ({
        ...state,
        isCreatingPatient: false,
      });
    }

    case ADD_PATIENT_SUCCESS: {
      const { patient } = action;
      return ({
        ...state,
        allPatients: [...state.allPatients, patient],
        isCreatingPatient: false,
        highlightedPatientId: patient.patientId,
      });
    }

    case ADD_PATIENT_ERROR: {
      const { error } = action;
      return ({
        ...state,
        creatingPatientError: error,
      });
    }

    case HIGHLIGHT_PATIENT: {
      if (state.isCreatingPatient) {
        return state;
      }

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
      return ({
        ...state,
        listPatients: patients,
      });
    }

    case UPDATE_PATIENT_SUCCESS: {
      const { patient } = action;
      return ({
        ...state,
        allPatients: state.allPatients.map(existingPatient => (
          existingPatient.patientId === patient.patientId ? patient : existingPatient
        )),
      });
    }

    case GET_PATIENT_SUCCESS: {
      const { patient } = action;
      return ({
        ...state,
        selectedPatient: patient,
      });
    }

    case REQUEST_EMR_PATIENTS:
      return Object.assign({}, state, {
        emrPatients: [],
        isFetching: true,
      });

    case CLEAR_EMR_PATIENTS:
      return Object.assign({}, state, { emrPatients: [] });

    case GET_EMR_PATIENTS_SUCCESS: {
      const { patients } = action;
      return ({
        ...state,
        emrPatients: patients,
        isFetching: false,
      });
    }

    case SELECT_EMR_PATIENT_SUCCESS: {
      const { patient } = action;
      return ({
        ...state,
        selectedEmrPatient: patient,
        emrPatients: [],
      });
    }

    case ADD_PATIENT_NOTE: {
      const { patientId, note } = action;

      const addNoteToPatient = map(when(
        propEq('patientId', patientId),
        over(lensProp('allNotes'), append(note)),
      ));

      return { ...state, allPatients: addNoteToPatient(state.allPatients) };
    }

    case UPDATE_PATIENT_NOTE: {
      const { patientId, note: { patientNoteId, description } } = action;

      const updateNote = map(when(
        propEq('patientNoteId', patientNoteId),
        set(lensProp('description'), description),
      ));

      const updateNoteInPatient = map(when(
        propEq('patientId', patientId),
        over(lensProp('allNotes'), updateNote),
      ));

      return { ...state, allPatients: updateNoteInPatient(state.allPatients) };
    }

    case DELETE_PATIENT_NOTE: {
      const { patientId, note: { patientNoteId } } = action;

      const removeNote = reject(propEq('patientNoteId', patientNoteId));

      const removeNoteFromPatient = map(when(
        propEq('patientId', patientId),
        over(lensProp('allNotes'), removeNote),
      ));

      return { ...state, allPatients: removeNoteFromPatient(state.allPatients) };
    }

    default:
      return state;
  }
};

export default PatientReducer;
