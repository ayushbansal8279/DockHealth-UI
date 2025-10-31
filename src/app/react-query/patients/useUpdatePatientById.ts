import { useMutation } from '@tanstack/react-query';
import { updatePatientById } from '@/app/api/patients-api';
import { ApiError, UseExtendedMutationOptions } from '../types';
import { Patient, PatientUpdateRequestParams } from '@/app/types/Patient';
import { updatePatientInCurrentPatientsList } from '@/app/actions/patients-actions';
import { useDispatch } from 'react-redux';
import * as AlertActions from 'alert/actions';
import * as PatientsActions from 'actions/patients-actions';

type Options = UseExtendedMutationOptions<
  Patient,
  ApiError,
  PatientUpdateRequestParams
>;

interface Config {
  options?: Options;
}

export const useUpdatePatientById = ({ options = {} }: Config = {}) => {
  const dispatch = useDispatch();
  const mutationFn = ({
    patientIdentifier,
    ...params
  }: PatientUpdateRequestParams) => {
    updatePatientById(patientIdentifier, params)
      .then((response) => {
        dispatch(
          updatePatientInCurrentPatientsList(patientIdentifier, response),
        );
      })
      .catch((error) => {
        dispatch(AlertActions.showGlobalErrorAlert());
        dispatch(PatientsActions.getCurrentPatients());
      });
  };

  return useMutation<Patient, ApiError, PatientUpdateRequestParams>({
    mutationFn,
    ...options,
  });
};
