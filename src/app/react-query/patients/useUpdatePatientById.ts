import { useMutation } from '@tanstack/react-query';
import { updatePatientById } from '@/app/api/patients-api';
import { ApiError, UseExtendedMutationOptions } from '../types';
import { Patient, PatientUpdateRequestParams } from '@/app/types/Patient';

type Options = UseExtendedMutationOptions<
  Patient,
  ApiError,
  PatientUpdateRequestParams
>;

interface Config {
  options?: Options;
}

export const useUpdatePatientById = ({ options = {} }: Config = {}) => {
  const mutationFn = ({
    patientIdentifier,
    ...params
  }: PatientUpdateRequestParams) =>
    updatePatientById(patientIdentifier, params);

  return useMutation<Patient, ApiError, PatientUpdateRequestParams>({
    mutationFn,
    ...options,
  });
};
