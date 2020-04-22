import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { addPatientToTask } from 'api/patient-api';
import { ADD_PATIENT_TO_TASK_SUCCESS } from '../action-types';

jest.mock('api/patient-api', () => ({
  addPatientToTask: jest.fn(),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('addPatientToTask', () => {
  it('should update due date', async () => {
    const expectedActions = [
      {
        type: ADD_PATIENT_TO_TASK_SUCCESS,
        taskIdentifier: 0,
        patient: { patientIdentifier: 3 },
      },
    ];

    const store = mockStore({
      taskState: {
        tasks: [{ taskIdentifier: 0, patient: null }],
      },
    });

    addPatientToTask.mockReturnValue(Promise.resolve({ patientIdentifier: 3 }));

    await store.dispatch(addPatientToTask(3, 0));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
