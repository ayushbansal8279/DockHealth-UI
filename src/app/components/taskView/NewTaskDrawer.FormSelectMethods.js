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
    const { userId, userName } = member || {};
    setValue('assignedToUserId', userId);
    setValue('assignedToUserName', userName);
    setCurrentMember(member);
    closeAssignedToPopover();

    if (hasTask) {
      try {
        await assignOrReassignTask(defaultValues, parseInt(userId, 10) || -1)(
          dispatch,
        );
        setAutoSaveVisible();
      } catch {
        toggleAlert(
          'Error updating assignment, please try again later',
          'error',
        );
      }
    }
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handlePatientSelect = patient => async () => {
    setValue('patient', JSON.stringify(patient));
    setValue('patientId', patient?.patientId);
    setValue('patientName', getPatientName(patient));
    closePatientPopover();

    if (hasTask) {
      try {
        await updatePatient(defaultValues, patient)(dispatch);
        setAutoSaveVisible();
      } catch {
        toggleAlert('Error updating patient, please try again later', 'error');
      }
    }
  };

  return { handleAssignedToSelect, handlePatientSelect };
};
