/* eslint-disable sonarjs/cognitive-complexity */
import * as ActionTypes from 'actions/action-types';

const initialState = {
  defaultPatientsLists: null,
  customPatientsLists: null,
  isFetching: false,
  currentPatientsListIdentifier: null,
  currentPatientsList: null,
};

const PatientsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.INITIALIZE_PATIENTS_LIST_STATE:
      return {
        ...state,
        currentPatientsListIdentifier: action.patientsListIdentifier,
        currentPatientsList: null,
      };

    case ActionTypes.CLEAR_PATIENTS_LIST_STATE:
      return {
        ...state,
        currentPatientsListIdentifier: null,
        currentPatientsList: null,
      };

    case ActionTypes.GET_CURRENT_PATIENTS_LIST_DETAILS:
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          isFetchingListDetails: true,
        },
      };

    case ActionTypes.GET_CURRENT_PATIENTS_LIST_DETAILS_SUCCESS:
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          isFetchingListDetails: false,
          listDetails: action.listDetails,
        },
      };

    case ActionTypes.GET_CURRENT_PATIENTS_LIST_DETAILS_FAILURE:
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          isFetchingListDetails: false,
        },
      };

    case ActionTypes.GET_CURRENT_PATIENTS:
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          isFetchingPatients: true,
        },
      };

    case ActionTypes.GET_CURRENT_PATIENTS_SUCCESS:
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          isFetchingPatients: false,
          patients: action.patients,
        },
      };

    case ActionTypes.GET_CURRENT_PATIENTS_FAILURE:
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          isFetchingPatients: false,
        },
      };

    case ActionTypes.GET_CURRENT_PATIENTS_LIST_FILTER_OPTIONS:
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          isFetchingFilterOptions: true,
        },
      };

    case ActionTypes.GET_CURRENT_PATIENTS_LIST_FILTER_OPTIONS_SUCCESS:
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          isFetchingFilterOptions: false,
          filterOptions: action.options,
        },
      };

    case ActionTypes.GET_CURRENT_PATIENTS_LIST_FILTER_OPTIONS_FAILURE:
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          isFetchingFilterOptions: false,
        },
      };

    case ActionTypes.CHANGE_PATIENTS_SEARCH_TERM:
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          searchTerm: action.searchTerm,
          selectedFilters: null,
        },
      };

    case ActionTypes.SET_PATIENTS_SELECTED_FILTERS: {
      const { selectedFilters } = action;

      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          searchTerm: '',
          selectedFilters,
        },
      };
    }

    case ActionTypes.CLEAR_PATIENTS_FILTERS:
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          selectedFilters: null,
        },
      };

    case ActionTypes.GET_PATIENTS_LISTS:
      return {
        ...state,
        isFetching: true,
      };

    case ActionTypes.GET_PATIENTS_LISTS_SUCCESS: {
      return {
        ...state,
        defaultPatientsLists: action.defaultPatientsLists,
        customPatientsLists: action.customPatientsLists,
        isFetching: false,
      };
    }

    case ActionTypes.DELETE_PATIENTS_LIST_SUCCESS: {
      const { identifier } = action;
      return {
        ...state,
        customPatientsLists: state.customPatientsLists?.filter(
          ({ patientListIdentifier }) => patientListIdentifier !== identifier,
        ),
      };
    }

    case ActionTypes.UPDATE_PATIENTS_LIST: {
      const { identifier, dataToUpdate } = action;

      return {
        ...state,
        customPatientsLists: state.customPatientsLists?.map(patientsList =>
          patientsList.patientListIdentifier === identifier
            ? {
                ...patientsList,
                ...dataToUpdate,
                isUpdating: true,
                error: false,
              }
            : patientsList,
        ),
      };
    }

    case ActionTypes.UPDATE_PATIENTS_LIST_SUCCESS: {
      const { identifier, dataToUpdate } = action;

      return {
        ...state,
        customPatientsLists: state.customPatientsLists?.map(patientsList =>
          patientsList.patientListIdentifier === identifier
            ? { ...patientsList, ...dataToUpdate, isUpdating: false }
            : patientsList,
        ),
      };
    }

    case ActionTypes.UPDATE_PATIENTS_LIST_FAILURE: {
      const { identifier } = action;

      return {
        ...state,
        customPatientsLists: state.customPatientsLists?.map(patientsList =>
          patientsList.patientListIdentifier === identifier
            ? { ...patientsList, isUpdating: false, error: true }
            : patientsList,
        ),
      };
    }

    default:
      return state;
  }
};

export default PatientsReducer;
