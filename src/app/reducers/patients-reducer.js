/* eslint-disable sonarjs/cognitive-complexity */
import * as ActionTypes from 'actions/action-types';
import {
  getPatientsListFiltersStorageKey,
  getPatientsDynamicListFiltersStorageKey,
} from 'helpers/patient-list-helpers';
import localStorageHelper from '../helpers/local-storage-helper';

const initialState = {
  defaultPatientsLists: null,
  customPatientsLists: null,
  isFetching: false,
  currentPatientsListIdentifier: null,
  currentPatientsList: null,
  searchPerformed: false,
  selectedDynamicPatientListFilter: null,
};

const PatientsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.INITIALIZE_PATIENTS_LIST_STATE: {
      const selectedFilters = localStorageHelper.getItem(
        getPatientsListFiltersStorageKey(action.patientsListIdentifier),
      );
      return {
        ...state,
        currentPatientsListIdentifier: action.patientsListIdentifier,
        currentPatientsList: {
          selectedFilters,
        },
      };
    }

    case ActionTypes.INITIALIZE_DYNAMIC_PATIENTS_LIST_STATE: {
      const selectedFilters = localStorageHelper.getItem(
        getPatientsDynamicListFiltersStorageKey(action.patientsListIdentifier),
      );
      return {
        ...state,
        currentPatientsListIdentifier: action.patientsListIdentifier,
        currentPatientsList: {
          selectedFilters,
        },
      };
    }

    case ActionTypes.CLEAR_PATIENTS_LIST_STATE: {
      return {
        ...state,
        currentPatientsListIdentifier: null,
        currentPatientsList: null,
      };
    }

    case ActionTypes.GET_CURRENT_PATIENTS_LIST_DETAILS: {
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          isFetchingListDetails: true,
        },
      };
    }

    case ActionTypes.GET_CURRENT_PATIENTS_LIST_DETAILS_SUCCESS: {
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          isFetchingListDetails: false,
          listDetails: action.listDetails,
        },
      };
    }

    case ActionTypes.GET_CURRENT_PATIENTS_LIST_DETAILS_FAILURE: {
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          isFetchingListDetails: false,
        },
      };
    }

    case ActionTypes.SEARCH_PATIENTS: {
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          searchPerformed: true,
        },
      };
    }

    case ActionTypes.CLEAR_PATIENT_SEARCH: {
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          searchPerformed: false,
        },
      };
    }

    case ActionTypes.GET_CURRENT_PATIENTS: {
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          isFetchingPatients: true,
        },
      };
    }

    case ActionTypes.GET_CURRENT_PATIENTS_SUCCESS: {
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          isFetchingPatients: false,
          patients: action.patients,
        },
      };
    }

    case ActionTypes.SILENTLY_GET_CURRENT_PATIENTS_SUCCESS: {
      const patients = state.currentPatientsList.patients;
      const newPatients = action.patients;

      // copy `isSelected` field from patients to newPatients
      if (!!patients && !!newPatients) {
        const selectedPatientsHash = {};
        for (const patient of patients) {
          if (patient.isSelected) {
            selectedPatientsHash[patient.patientIdentifier] = true;
          }
        }

        for (const patient of newPatients) {
          if (selectedPatientsHash[patient.patientIdentifier]) {
            patient.isSelected = true;
          }
        }
      }

      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          patients: newPatients,
        },
      };
    }

    case ActionTypes.GET_CURRENT_PATIENTS_FAILURE: {
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          isFetchingPatients: false,
        },
      };
    }

    case ActionTypes.GET_CURRENT_PATIENTS_LIST_FILTER_OPTIONS: {
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          isFetchingFilterOptions: true,
        },
      };
    }

    case ActionTypes.GET_CURRENT_PATIENTS_LIST_FILTER_OPTIONS_SUCCESS: {
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          isFetchingFilterOptions: false,
          filterOptions: action.options,
        },
      };
    }

    case ActionTypes.GET_CURRENT_PATIENTS_LIST_FILTER_OPTIONS_FAILURE: {
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          isFetchingFilterOptions: false,
        },
      };
    }

    case ActionTypes.CHANGE_PATIENTS_SEARCH_TERM: {
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          searchTerm: action.searchTerm,
          selectedFilters: null,
        },
      };
    }

    case ActionTypes.SET_PATIENTS_SELECTED_FILTERS: {
      const { selectedFilters } = action;
      if (selectedFilters) {
        localStorageHelper.setItem(
          getPatientsListFiltersStorageKey(state.currentPatientsListIdentifier),
          selectedFilters,
        );
      } else {
        localStorageHelper.removeItem(
          getPatientsListFiltersStorageKey(state.currentPatientsListIdentifier),
        );
      }

      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          searchTerm: '',
          selectedFilters,
        },
      };
    }

    case ActionTypes.SET_DYNAMIC_PATIENTS_SELECTED_FILTERS: {
      const { selectedFilters } = action;
      if (selectedFilters) {
        localStorageHelper.setItem(
          getPatientsDynamicListFiltersStorageKey(
            state.currentPatientsListIdentifier,
          ),
          selectedFilters,
        );
      } else {
        localStorageHelper.removeItem(
          getPatientsDynamicListFiltersStorageKey(
            state.currentPatientsListIdentifier,
          ),
        );
      }

      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          searchTerm: '',
          selectedFilters,
        },
      };
    }

    case ActionTypes.CLEAR_PATIENTS_FILTERS: {
      localStorageHelper.removeItem(
        getPatientsListFiltersStorageKey(state.currentPatientsListIdentifier),
      );
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          selectedFilters: null,
        },
      };
    }

    case ActionTypes.GET_PATIENTS_LISTS: {
      return {
        ...state,
        isFetching: true,
      };
    }

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
        customPatientsLists: state.customPatientsLists?.map((patientsList) =>
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
        customPatientsLists: state.customPatientsLists?.map((patientsList) =>
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
        customPatientsLists: state.customPatientsLists?.map((patientsList) =>
          patientsList.patientListIdentifier === identifier
            ? { ...patientsList, isUpdating: false, error: true }
            : patientsList,
        ),
      };
    }

    case ActionTypes.SET_SELECTED_PATIENT: {
      const { identifier, isSelected } = action;
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          patients: state.currentPatientsList.patients?.map((patient) =>
            patient.patientIdentifier === identifier
              ? { ...patient, isSelected }
              : patient,
          ),
        },
      };
    }

    case ActionTypes.UNSELECT_ALL_PATIENTS: {
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          patients: state.currentPatientsList?.patients?.map((patient) => ({
            ...patient,
            isSelected: false,
          })),
        },
      };
    }

    case ActionTypes.SELECT_ALL_PATIENTS: {
      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          patients: state.currentPatientsList?.patients?.map((patient) => ({
            ...patient,
            isSelected: true,
          })),
        },
      };
    }

    case (ActionTypes.PATIENT_BULK_DELETE_PATIENTS_SUCCESS,
    ActionTypes.PATIENT_BULK_UPDATE_PATIENTS_SUCCESS): {
      const { patientIdentifiers } = action;

      return {
        ...state,
        currentPatientsList: {
          ...state.currentPatientsList,
          patients: state.currentPatientsList.patients?.filter(
            ({ patientIdentifier }) =>
              !patientIdentifiers.includes(patientIdentifier),
          ),
        },
      };
    }

    case ActionTypes.SELECT_DYNAMIC_PATIENT_LIST_FILTER: {
      return {
        ...state,
        selectedDynamicPatientListFilter:
          action.dynamicPatientListFilterIdentifier,
      };
    }

    default: {
      return state;
    }
  }
};

export default PatientsReducer;
