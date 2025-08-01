import { useSelector } from 'react-redux';
import { selectedUserOrganizationSelector } from '../selectors/user-selectors';
import { patientDetailsStateSelector } from '../selectors/patient-details-selectors';

export function useIsWorkspaceScopedPatient() {
  const patient = useSelector(patientDetailsStateSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);

  const patientOrgId = patient?.patient?.organizationIdentifier;
  const isWorkspaceScopedPatient =
    !!patientOrgId && patientOrgId !== currentOrganization?.organizationIdentifier;

  return {
    isWorkspaceScopedPatient,
    workspaceIdentifier: isWorkspaceScopedPatient ? patientOrgId : null,
  };
}