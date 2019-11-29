import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { getPatientName } from '../../helpers/utilityFunctions';
import useBoolean from '../../hooks/useBoolean';
import { MemberName } from '../members/MemberPicker';
import MemberSlot from '../members/MemberSlot';
import StyledInput from '../userProfileView/StyledInput';
import NewTaskDrawerAddPatientForm from './NewTaskDrawer.addPatientForm';
import NewTaskDrawerInviteToListForm from './NewTaskDrawer.inviteToListForm';
import NewTaskDrawerPersonPicker from './NewTaskDrawer.personPicker';
import NewTaskDrawerEditTaskComponent from './NewTaskDrawer.editTaskComponent';
import NewTaskDrawerEmailBodyContainer from './NewTaskDrawer.emailBody';

import {
  updatePatient,
  assignOrReassignTask,
} from '../../actions/task-actions';

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

const AssignedToItemContainer = styled(PatientItemContainer)`
  height: 4.0625rem;

  && > div {
    &:first-child {
      height: 3.4375rem;
      width: 3.4375rem;

      > div {
        height: 100%;
        width: 100%;

        & img[alt='Unassigned'] {
          width: 1.75rem !important;
        }
      }
    }

    &:last-child {
      flex: 1;

      &:not(:only-child) {
        margin-left: 1rem;
      }
    }
  }
`;

const MemberSlotContainer = styled.div`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);

  && > div {
    height: 3.4375rem;
    width: 3.4375rem;

    > div {
      height: 100%;
      width: 100%;

      & img[alt='Unassigned'] {
        width: 1.75rem !important;
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
      <div>{patient?.mrn || ''}</div>
      <div>{patientName || ''}</div>
    </PatientItemContainer>
  );
};

const renderNoPatientItem = ({ handlePatientSelect }) => () => (
  <PatientItemContainer onClick={handlePatientSelect(null)}>
    <div>Unassigned</div>
  </PatientItemContainer>
);

const renderAssignedToItem = ({ handleAssignedToSelect }) => member => {
  return (
    <AssignedToItemContainer
      key={member?.userId}
      onClick={handleAssignedToSelect(member)}
    >
      <MemberSlot member={member} />
      <MemberName>{member?.userName ?? 'Unassigned'}</MemberName>
    </AssignedToItemContainer>
  );
};

const renderNoAssignedToItem = ({ handleAssignedToSelect }) => () => {
  return (
    <AssignedToItemContainer onClick={handleAssignedToSelect(null)}>
      <MemberSlot member={null} />
      <MemberName>Unassigned</MemberName>
    </AssignedToItemContainer>
  );
};

export default ({
  defaultValues,
  isSubtask,
  handleSubmit,
  onMarkComplete,
  setAutoSaveVisible,
  isInbox,
}) => {
  const formMethods = useFormContext();
  const [currentMember, setCurrentMember] = useState(defaultValues?.assignedTo);
  const dispatch = useDispatch();

  const { reset, register, setValue } = formMethods;

  const hasTask = Boolean(defaultValues?.taskId);

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
      closeAssignedToPopover();
      closePatientPopover();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasTask],
  );

  useEffect(
    () => {
      setCurrentMember(defaultValues?.assignedTo);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultValues?.assignedToUserId],
  );

  const members = useSelector(store =>
    isInbox
      ? [store.userState.userProfile]
      : store.taskListState.tasklistmembers,
  );
  const patients = useSelector(store => store.patientState.allPatients);

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

  const styledInputProps = {
    fontSize: 20,
    labelFontSize: 16,
  };

  const rightAdornment = (
    <MemberSlotContainer>
      <MemberSlot member={currentMember} />
    </MemberSlotContainer>
  );

  return (
    <>
      <input ref={register} type="hidden" name="assignedToUserId" />
      <input ref={register} type="hidden" name="patient" />
      <input ref={register} type="hidden" name="patientId" />
      <FormContainer container spacing={8}>
        <Grid item xs={12}>
          {hasTask ? (
            <NewTaskDrawerEditTaskComponent
              handleSubmit={handleSubmit}
              onMarkComplete={onMarkComplete}
              setAutoSaveVisible={setAutoSaveVisible}
            />
          ) : (
            <StyledInput
              {...styledInputProps}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  event.stopPropagation();
                  handleSubmit();
                }
              }}
              isTextarea
              autoFocus
              name="description"
              label="Task"
              required
            />
          )}
        </Grid>
        {defaultValues.sourceMessage && (
          <Grid item xs={12}>
            <NewTaskDrawerEmailBodyContainer
              emailBody={defaultValues.sourceMessage}
            />
          </Grid>
        )}
        {!isSubtask && (
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
        )}
        <Grid item xs={12}>
          {assignedToPopoverOpen && (
            <NewTaskDrawerPersonPicker
              addNewPersonLabel="+ Invite to list"
              addingNewPersonLabel="Invite to list"
              closePicker={closeAssignedToPopover}
              items={members}
              itemFilterPropertyKeys={['userName']}
              label="Assigned to"
              maxPeopleRecordsVisible={5}
              renderItem={renderAssignedToItem({ handleAssignedToSelect })}
              renderNoItems={renderNoAssignedToItem({ handleAssignedToSelect })}
              personRecordHeightInRem={4.0625}
              AddingPersonForm={NewTaskDrawerInviteToListForm}
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
            rightAdornment={rightAdornment}
          />
        </Grid>
      </FormContainer>
    </>
  );
};
