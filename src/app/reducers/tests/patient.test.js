import reducer from '../patient';
import {
  FETCH_PATIENT,
  FETCH_PATIENT_ERROR,
  FETCH_PATIENT_SUCCESS,
} from '../../actions/action-types';

describe('patient reducer', () => {
  it('should return initial state', () => {
    const state = reducer(undefined, {});
    const expected = { details: null, isLoading: false, error: null };
    expect(state).toEqual(expected);
  });
  it('should handle FETCH_PATIENT', () => {
    const action = { type: FETCH_PATIENT };
    const state = reducer(undefined, action);
    const expected = { details: null, isLoading: true, error: null };
    expect(state).toEqual(expected);
  });
  it('should handle FETCH_PATIENT_ERROR', () => {
    const error = 'Something wrong.';
    const action = { type: FETCH_PATIENT_ERROR, error };
    const state = reducer(undefined, action);
    const expected = { details: null, isLoading: false, error };
    expect(state).toEqual(expected);
  });
  it('should handle FETCH_PATIENT_SUCCESS', () => {
    const details = { patientIdentifier: 0 };
    const action = { type: FETCH_PATIENT_SUCCESS, details };
    const state = reducer(undefined, action);
    const expected = { details, isLoading: false, error: null };
    expect(state).toEqual(expected);
  });
});
