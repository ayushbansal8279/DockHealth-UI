import * as AlertActions from 'alert/actions';

export default ({
  setValue,
  setCurrentMember,
  closeAssignedToPopover,
  closePatientPopover,
  hasTask,
  assignOrReassignTask,
  defaultValues,
  dispatch,
  setAutoSaveVisible,
  getPatientName,
  updatePatient,
}) => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleAssignedToSelect = member => async () => {
    const { userIdentifier, userName } = member || {};
    setValue('assignedToUserIdentifier', userIdentifier);
    setValue('assignedToUserName', userName);
    setCurrentMember(member);
    closeAssignedToPopover();

    if (hasTask) {
      try {
        await assignOrReassignTask(
          defaultValues,
          userIdentifier || -1,
        )(dispatch);
        setAutoSaveVisible();
      } catch {
        dispatch(AlertActions.showGlobalAlert(
          'Error updating assignment, please try again later',
          'error',
        );
      }
    }
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handlePatientSelect = patient => async () => {
    setValue('patient', JSON.stringify(patient));
    setValue('patientIdentifier', patient?.patientIdentifier);
    setValue('patientName', getPatientName(patient));
    closePatientPopover();

    if (hasTask) {
      try {
        await updatePatient(defaultValues, patient)(dispatch);
        setAutoSaveVisible();
      } catch {
        dispatch(AlertActions.showGlobalAlert('Error updating patient, please try again later', 'error'));
      }
    }
  };

  return { handleAssignedToSelect, handlePatientSelect };
};
