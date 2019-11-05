import Grid from '@material-ui/core/Grid';
import React, { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { getPatientName } from '../../helpers/utilityFunctions';
import useBoolean from '../../hooks/useBoolean';
import { MemberName } from '../members/MemberPicker';
import MemberSlot from '../members/MemberSlot';
import StyledInput from '../userProfileView/StyledInput';
import NewTaskDrawerPersonPicker from './NewTaskDrawer.personPicker';

const FormContainer = styled(Grid)`
  padding-top: 16px;
`;

const renderAssignedToItem = member => (
  <>
    <MemberSlot member={member} />
    <MemberName>{member?.userName ?? 'Unassigned'}</MemberName>
  </>
);

const renderPatientItem = patient => {
  const patientName = getPatientName(patient);

  return <div>{patientName || 'Unassigned'}</div>;
};

export default ({ defaultValues, isSubtask }) => {
  const formMethods = useFormContext();
  const { reset, register, setValue, watch } = formMethods;

  const assignedToRef = useRef(null);
  const [
    assignedToPopoverOpen,
    openAssignedToPopover,
    closeAssignedToPopover,
  ] = useBoolean(false);
  const currentAssignedTo = watch('assignedTo');

  const patientRef = useRef(null);
  const [
    patientPopoverOpen,
    openPatientPopover,
    closePatientPopover,
  ] = useBoolean(false);
  const currentPatient = watch('patient');

  useEffect(
    () => {
      reset(defaultValues);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultValues?.taskId],
  );

  const members = useSelector(store => store.taskListState.tasklistmembers);
  const patients = useSelector(store => store.patientState.allPatients);

  const handleAssignedToSelect = member => () => {
    const { userId, userName } = member || {};
    setValue('assignedToUserId', userId);
    setValue('assignedToUserName', userName);
    closeAssignedToPopover();
  };

  const handlePatientSelect = patient => () => {
    setValue('patient', JSON.stringify(patient));
    setValue('patientId', patient?.patientId);
    setValue('patientName', getPatientName(patient));
    closePatientPopover();
  };

  const styledInputProps = {
    fontSize: 20,
    labelFontSize: 16,
  };

  return (
    <>
      <input ref={register} type="hidden" name="assignedToUserId" />
      <input ref={register} type="hidden" name="patient" />
      <input ref={register} type="hidden" name="patientId" />
      <FormContainer container spacing={8}>
        <Grid item xs={12}>
          <StyledInput
            {...styledInputProps}
            isTextarea
            name="description"
            label="Task"
          />
        </Grid>
        <Grid item xs={12}>
          <StyledInput
            {...styledInputProps}
            ref={patientRef}
            name="patientName"
            label="Patient Information"
            controlled
            fullWidth
            containerDisabled={isSubtask}
            onContainerClick={() => {
              openPatientPopover();
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <StyledInput
            {...styledInputProps}
            ref={assignedToRef}
            name="assignedToUserName"
            label="Assigned to"
            controlled
            fullWidth
            onContainerClick={() => {
              openAssignedToPopover();
            }}
          />
        </Grid>
      </FormContainer>
      <NewTaskDrawerPersonPicker
        anchorEl={assignedToRef}
        closePopover={closeAssignedToPopover}
        currentItem={currentAssignedTo}
        items={members}
        itemComparisonKey="userId"
        itemFilterPropertyKeys={['userName']}
        open={assignedToPopoverOpen}
        onPersonClick={handleAssignedToSelect}
        renderItem={renderAssignedToItem}
      />
      <NewTaskDrawerPersonPicker
        anchorEl={patientRef}
        closePopover={closePatientPopover}
        currentItem={currentPatient}
        items={patients}
        itemComparisonKey="patientId"
        itemFilterPropertyKeys={['mrn', 'firstName', 'middleName', 'lastName']}
        open={patientPopoverOpen}
        onPersonClick={handlePatientSelect}
        renderItem={renderPatientItem}
      />
    </>
  );
};
