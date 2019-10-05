import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import PatientApi from '../../api/patient-api';
import { fetchPatient } from '../patient';
import { FETCH_PATIENT, FETCH_PATIENT_ERROR, FETCH_PATIENT_SUCCESS } from '../action-types';

jest.mock('../../api/patient-api', () => ({
  getPatientById: jest.fn(),
}));

const mockStore = configureStore([thunk]);

describe('fetchPatient', () => {
  it('should fetch patient', async () => {
    const details = { patientId: 0 };
    PatientApi.getPatientById.mockReturnValue(Promise.resolve(details));

    const store = mockStore({
      patient: {
        details: null,
        isLoading: false,
        error: null,
      },
    });
    await store.dispatch(fetchPatient(0));

    const expectedActions = [
      { type: FETCH_PATIENT },
      { type: FETCH_PATIENT_SUCCESS, details },
    ];
    expect(store.getActions()).toEqual(expectedActions);
  });
  it('should handle fetch error', async () => {
    const error = 'Something wrong.';
    PatientApi.getPatientById.mockReturnValue(Promise.reject(error));

    const store = mockStore({
      patient: {
        details: null,
        isLoading: false,
        error: null,
      },
    });
    await store.dispatch(fetchPatient(0));

    const expectedActions = [
      { type: FETCH_PATIENT },
      { type: FETCH_PATIENT_ERROR, error },
    ];
    expect(store.getActions()).toEqual(expectedActions);
  });
});
