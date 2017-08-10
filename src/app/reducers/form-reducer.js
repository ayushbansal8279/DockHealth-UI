import * as types from '../actions/action-types';
import initialState from './initialState';
import {reducer as formReducer} from 'redux-form';

const FormReducer = formReducer.plugin({
  FormPatient: (state, action) => { 
    switch(action.type) {
      case types.PATIENT_SELECTION_RESET:
        return undefined;       // <--- blow away form data
      default:
        return state;
    }
  }
})

export default FormReducer
