import * as types from 'actions/action-types';

const initialState = {
  defaultPatientsLists: [],
  customPatientsLists: [],
  isFetching: false,
};

const PatientsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_PATIENTS_LISTS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case types.GET_PATIENTS_LISTS_SUCCESS: {
      return {
        ...state,
        defaultPatientsLists: action.patientsLists.filter(
          ({ listType }) => listType === 'DEFAULT',
        ),
        customPatientsLists: action.patientsLists.filter(
          ({ listType }) => listType === 'ADHOC',
        ),
        isFetching: false,
      };
    }

    case types.DELETE_PATIENTS_LIST: {
      const { identifier } = action;
      return {
        ...state,
        customPatientsLists: state.customPatientsLists?.filter(
          ({ patientListIdentifier }) => patientListIdentifier !== identifier,
        ),
      };
    }

    case types.UPDATE_PATIENTS_LIST: {
      const { identifier, dataToUpdate } = action;

      return {
        ...state,
        customPatientsLists: state.customPatientsLists?.map(patientsList =>
          patientsList.patientListIdentifier === identifier
            ? { ...patientsList, ...dataToUpdate }
            : patientsList,
        ),
      };
    }

    default:
      return state;
  }
};

export default PatientsReducer;
