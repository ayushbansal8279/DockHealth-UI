import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { addPatientToTask } from '../patient-actions';
import { ADD_PATIENT_TO_TASK_SUCCESS } from '../action-types';
import PatientApi from '../../api/patient-api';

jest.mock('../../api/patient-api', () => ({
  addPatientToTask: jest.fn(),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('addPatientToTask', () => {
  it('should update due date', async () => {
    const expectedActions = [
      {
        type: ADD_PATIENT_TO_TASK_SUCCESS,
        taskId: 0,
        patient: { patientId: 3 },
      },
    ];

    const store = mockStore({
      taskState: {
        tasks: [{ taskId: 0, patient: null }],
      },
    });

    PatientApi.addPatientToTask.mockReturnValue(
      Promise.resolve({ patientId: 3 }),
    );

    await store.dispatch(addPatientToTask(3, 0));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
