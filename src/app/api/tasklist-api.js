import axios from 'axios';
import * as ActionTypes from '../actions/action-types';


export function getTaskListForUser(userId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'list/findTaskListsByUserId/'+userId)
    .then(response => {
      return response.data;
    });
}
