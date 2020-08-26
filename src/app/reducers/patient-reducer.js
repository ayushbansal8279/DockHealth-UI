import {
  append,
  isNil,
  lensProp,
  map,
  over,
  propEq,
  reject,
  when,
} from 'ramda';
import {
  ABORT_PATIENT_CREATION,
  ADD_PATIENT_ERROR,
  ADD_PATIENT_NOTE,
  ADD_PATIENT_SUCCESS,
  BEGIN_PATIENT_CREATION,
  CLEAR_EMR_PATIENTS,
  DELETE_PATIENT_NOTE,
  GET_EMR_PATIENTS_SUCCESS,
  GET_LIST_PATIENTS_SUCCESS,
  GET_PATIENTS_SUCCESS,
  GET_PATIENT_SUCCESS,
  HIGHLIGHT_PATIENT,
  REQUEST_EMR_PATIENTS,
  REQUEST_PATIENTS,
  SELECT_EMR_PATIENT_SUCCESS,
  UPDATE_PATIENT_NOTE,
  UPDATE_PATIENT_SUCCESS,
  GET_PATIENT_IMPORT_DETAILS,
} from 'actions/action-types';

const initialState = {
  allPatients: [],
  highlightedPatientIdentifier: null,
  listPatients: [],
  selectedPatient: null,
  emrPatients: [],
  selectedEmrPatient: null,
  isCreatingPatient: false,
};

const PatientReducer = (state = initialState, action) => {
  switch (action.type) {
    case BEGIN_PATIENT_CREATION: {
      return {
        ...state,
        isCreatingPatient: true,
        highlightedPatientIdentifier: null,
      };
    }

    case ABORT_PATIENT_CREATION: {
      return {
        ...state,
        isCreatingPatient: false,
      };
    }

    case ADD_PATIENT_SUCCESS: {
      const { patient } = action;
      return {
        ...state,
        allPatients: [...state.allPatients, patient],
        isCreatingPatient: false,
        highlightedPatientIdentifier: patient.patientIdentifier,
      };
    }

    case ADD_PATIENT_ERROR: {
      const { error } = action;
      return {
        ...state,
        creatingPatientError: error,
      };
    }

    case HIGHLIGHT_PATIENT: {
      const { patientIdentifier } = action;
      const { isCreatingPatient } = state;

      if (isNil(patientIdentifier) && isCreatingPatient) {
        return state;
      }

      return {
        ...state,
        isCreatingPatient: false,
        highlightedPatientIdentifier: patientIdentifier,
      };
    }

    case GET_PATIENTS_SUCCESS: {
      const { patients } = action;
      return {
        ...state,
        allPatients: patients,
        isFetching: false,
      };
    }

    case REQUEST_PATIENTS: {
      return {
        ...state,
        isFetching: true,
      };
    }

    case GET_LIST_PATIENTS_SUCCESS: {
      const { patients } = action;
      return {
        ...state,
        listPatients: patients,
      };
    }

    case UPDATE_PATIENT_SUCCESS: {
      const { patient } = action;
      return {
        ...state,
        allPatients: state.allPatients.map(existingPatient =>
          existingPatient.patientIdentifier === patient.patientIdentifier
            ? patient
            : existingPatient,
        ),
      };
    }

    case GET_PATIENT_SUCCESS: {
      const { patient } = action;
      return {
        ...state,
        selectedPatient: patient,
      };
    }

    case REQUEST_EMR_PATIENTS:
      return { ...state, emrPatients: [], isFetching: true };

    case CLEAR_EMR_PATIENTS:
      return { ...state, emrPatients: [] };

    case GET_EMR_PATIENTS_SUCCESS: {
      const { patients } = action;
      return {
        ...state,
        emrPatients: patients,
        isFetching: false,
      };
    }

    case SELECT_EMR_PATIENT_SUCCESS: {
      const { patient } = action;
      return {
        ...state,
        selectedEmrPatient: patient,
        emrPatients: [],
      };
    }

    case ADD_PATIENT_NOTE: {
      const { patientIdentifier, note } = action;

      const addNoteToPatient = map(
        when(
          propEq('patientIdentifier', patientIdentifier),
          over(lensProp('allNotes'), append(note)),
        ),
      );

      return { ...state, allPatients: addNoteToPatient(state.allPatients) };
    }

    case UPDATE_PATIENT_NOTE: {
      const { note } = action;

      const { patientNoteIdentifier } = note;

      const newAllPatients = state.allPatients.map(patient => ({
        ...patient,
        allNotes: patient.allNotes.map(oldNote =>
          oldNote.patientNoteIdentifier === patientNoteIdentifier
            ? note
            : oldNote,
        ),
      }));

      return { ...state, allPatients: newAllPatients };
    }

    case DELETE_PATIENT_NOTE: {
      const {
        patientIdentifier,
        note: { patientNoteIdentifier },
      } = action;

      const removeNote = reject(
        propEq('patientNoteIdentifier', patientNoteIdentifier),
      );

      const removeNoteFromPatient = map(
        when(
          propEq('patientIdentifier', patientIdentifier),
          over(lensProp('allNotes'), removeNote),
        ),
      );

      return {
        ...state,
        allPatients: removeNoteFromPatient(state.allPatients),
      };
    }

    case GET_PATIENT_IMPORT_DETAILS: {
      const { patientImportDetails } = action;
      return {
        ...state,
        patientImportDetails,
      };
    }

    default:
      return state;
  }
};

export default PatientReducer;
