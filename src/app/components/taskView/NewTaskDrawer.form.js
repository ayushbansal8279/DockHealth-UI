import Grid from '@material-ui/core/Grid';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { getPatientName } from '../../helpers/utilityFunctions';
import useBoolean from '../../hooks/useBoolean';
import { MemberName } from '../members/MemberPicker';
import MemberSlot from '../members/MemberSlot';
import StyledInput from '../userProfileView/StyledInput';
import NewTaskDrawerPersonPicker from './NewTaskDrawer.personPicker';
import NewTaskDrawerAddPatientForm from './NewTaskDrawer.addPatientForm';

const FormContainer = styled(Grid)`
  padding-top: 16px;
`;

const PatientItemContainer = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  height: 2.3125rem;
  margin-left: 0.1875rem;
  margin-right: 1.75rem;
  padding-left: 0.9375rem;
  padding-right: 0.9375rem;
  transition: all 0.25s ease-out;

  &:hover {
    background-color: #d4f3ff;
  }

  & > div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:first-child {
      width: 5.375rem;
    }

    &:last-child {
      flex: 1;

      &:not(:only-child) {
        padding-left: 2rem;
      }
    }
  }
`;

const renderPatientItem = ({ handlePatientSelect }) => patient => {
  const patientName = getPatientName({ withMrn: false, ...patient });

  return (
    <PatientItemContainer
      key={patient?.patientId}
      onClick={handlePatientSelect(patient)}
    >
      <div>{patient?.mrn || '-'}</div>
      <div>{patientName || '-'}</div>
    </PatientItemContainer>
  );
};

const renderNoPatientItem = ({ handlePatientSelect }) => () => (
  <PatientItemContainer onClick={handlePatientSelect(null)}>
    <div>Unassigned</div>
  </PatientItemContainer>
);

const renderAssignedToItem = ({ handleAssignedToSelect }) => member => (
  <>
    <MemberSlot member={member} />
    <MemberName>{member?.userName ?? 'Unassigned'}</MemberName>
  </>
);

const renderNoAssignedToItem = ({ handleAssignedToSelect }) => () => {
  return (
    <Grid container justify="center">
      No people found.
    </Grid>
  );
};

export default ({ defaultValues, isSubtask }) => {
  const formMethods = useFormContext();
  const { reset, register, setValue } = formMethods;

  const [
    assignedToPopoverOpen,
    openAssignedToPopover,
    closeAssignedToPopover,
  ] = useBoolean(false);

  const [
    patientPopoverOpen,
    openPatientPopover,
    closePatientPopover,
  ] = useBoolean(false);

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
          {patientPopoverOpen && (
            <NewTaskDrawerPersonPicker
              addNewPersonLabel="+ Add a new patient"
              addingNewPersonLabel="Add a new patient"
              closePicker={closePatientPopover}
              items={patients}
              itemFilterPropertyKeys={[
                'mrn',
                'firstName',
                'middleName',
                'lastName',
              ]}
              label="Patient Information"
              maxPeopleRecordsVisible={7}
              renderItem={renderPatientItem({ handlePatientSelect })}
              renderNoItems={renderNoPatientItem({ handlePatientSelect })}
              personRecordHeightInRem={2.3125}
              AddingPersonForm={NewTaskDrawerAddPatientForm}
            />
          )}
          <StyledInput
            {...styledInputProps}
            name="patientName"
            label="Patient Information"
            controlled
            fullWidth
            visible={!patientPopoverOpen}
            containerDisabled={isSubtask}
            onContainerClick={() => {
              openPatientPopover();
            }}
          />
        </Grid>
        <Grid item xs={12}>
          {assignedToPopoverOpen && (
            <NewTaskDrawerPersonPicker
              addNewPersonLabel="+ Invite to list"
              addingNewPersonLabel="Invite to list"
              closePicker={closeAssignedToPopover}
              items={members}
              itemFilterPropertyKeys={['userName']}
              label="Assigned to"
              renderItem={renderAssignedToItem({ handleAssignedToSelect })}
              renderNoItems={renderNoAssignedToItem({ handleAssignedToSelect })}
              personRecordHeightInRem={2.3125}
              maxPeopleRecordsVisible={5}
            />
          )}
          <StyledInput
            {...styledInputProps}
            name="assignedToUserName"
            label="Assigned to"
            visible={!assignedToPopoverOpen}
            controlled
            fullWidth
            onContainerClick={() => {
              openAssignedToPopover();
            }}
          />
        </Grid>
      </FormContainer>
    </>
  );
};
