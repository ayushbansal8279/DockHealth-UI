import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useDeepCompareEffect } from 'react-use';
import styled from 'styled-components';

import {
  assignOrReassignTask,
  updatePatient,
} from '../../actions/task-actions';
import { getPatientName } from '../../helpers/utility-functions';
import useBoolean from '../../hooks/useBoolean';
import { MemberName } from '../members/MemberPicker';
import MemberSlot from '../members/MemberSlot';
import StyledInput from '../userProfileView/StyledInput';
import NewTaskDrawerAddPatientForm from './NewTaskDrawer.AddPatientForm';
import NewTaskDrawerEditTaskComponent from './NewTaskDrawer.EditTaskComponent';
import NewTaskDrawerEmailBodyContainer from './NewTaskDrawer.EmailBody';
import initializeNewTaskDrawerFormSelectMethods from './NewTaskDrawer.FormSelectMethods';
import NewTaskDrawerInviteToListForm from './NewTaskDrawer.InviteToListForm';
import NewTaskDrawerPersonPicker from './NewTaskDrawer.PersonPicker';

const FormContainer = styled(Grid)`
  padding-top: 16px;
`;

const PatientItemContainer = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  height: 2.3125rem
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
      key={patient?.patientIdentifier}
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
      key={member?.userIdentifier}
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

const RightAdornment = ({ currentMember }) => (
  <MemberSlotContainer>
    <MemberSlot member={currentMember} />
  </MemberSlotContainer>
);

export default ({
  defaultValues,
  isSubtask,
  handleSubmit,
  onMarkComplete,
  setAutoSaveVisible,
  isInbox,
  isSpecificPatient,
  setPopoversOpen,
}) => {
  const formMethods = useFormContext();
  const [currentMember, setCurrentMember] = useState(defaultValues?.assignedTo);
  const dispatch = useDispatch();

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

  const { reset, register, setValue } = formMethods;

  const hasTask = Boolean(defaultValues?.taskIdentifier);

  const {
    handleAssignedToSelect,
    handlePatientSelect,
  } = initializeNewTaskDrawerFormSelectMethods({
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
  });

  useEffect(() => {
    setPopoversOpen({
      assignedToPopoverOpen,
      patientPopoverOpen,
    });
  }, [assignedToPopoverOpen, patientPopoverOpen, setPopoversOpen]);

  useEffect(
    () => {
      reset(defaultValues);
      closeAssignedToPopover();
      closePatientPopover();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasTask],
  );

  useDeepCompareEffect(() => {
    setValue('patient', JSON.stringify(defaultValues?.patient));
    setValue('patientIdentifier', defaultValues?.patient?.patientIdentifier);
    setValue('patientName', getPatientName(defaultValues?.patient));
    setValue('assignedToUserIdentifier', defaultValues?.assignedToUserIdentifier);
    setValue('assignedToUserName', defaultValues?.assignedToUserName);
  }, [defaultValues, setValue]);

  useEffect(
    () => {
      setCurrentMember(defaultValues?.assignedTo);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultValues?.assignedToUserIdentifier],
  );

  const members = useSelector(store =>
    isInbox
      ? [store.userState.userProfile]
      : store.taskListState.tasklistmembers,
  );
  const patients = useSelector(store => store.patientState.allPatients);

  const styledInputProps = {
    fontSize: 20,
    labelFontSize: 16,
  };

  return (
    <>
      <input ref={register} type="hidden" name="assignedToUserIdentifier" />
      <input ref={register} type="hidden" name="patient" />
      <input ref={register} type="hidden" name="patientIdentifier" />
      <FormContainer container spacing={8}>
        <Grid item xs={12}>
          {hasTask ? (
            <NewTaskDrawerEditTaskComponent
              handleSubmit={handleSubmit}
              onMarkComplete={onMarkComplete}
              setAutoSaveVisible={setAutoSaveVisible}
              members={members}
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
              fontSize={16}
              labelFontSize={13}
              labelInactiveTop={1.75}
              required
            />
          )}
        </Grid>
        {defaultValues.sourceMessage && (
          <Grid item xs={12}>
            <NewTaskDrawerEmailBodyContainer
              emailBody={defaultValues.sourceMessage}
              task={defaultValues}
              members={members}
            />
          </Grid>
        )}
        {!isSubtask && !isSpecificPatient && (
          <Grid item xs={12}>
            {patientPopoverOpen && (
              <NewTaskDrawerPersonPicker
                showAddNewPersonLabel
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
                handlePersonSelect={handlePatientSelect}
                personRecordHeightInRem={2.3125}
                AddingPersonForm={NewTaskDrawerAddPatientForm}
              />
            )}
            <StyledInput
              name="patientName"
              label="Patient Information"
              controlled
              fullWidth
              visible={!patientPopoverOpen}
              containerDisabled={isSubtask}
              fontSize={16}
              labelFontSize={13}
              containerHeight={4.375}
              onContainerClick={() => {
                openPatientPopover();
              }}
            />
          </Grid>
        )}
        {isSpecificPatient && (
          <Grid item xs={12}>
            <StyledInput
              name="patientName"
              label="Patient Information"
              controlled
              fullWidth
              containerDisabled
              fontSize={16}
              labelFontSize={13}
              containerHeight={4.375}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          {assignedToPopoverOpen && (
            <NewTaskDrawerPersonPicker
              closePicker={closeAssignedToPopover}
              items={members}
              itemFilterPropertyKeys={['userName']}
              label="Assigned to"
              maxPeopleRecordsVisible={5}
              renderItem={renderAssignedToItem({ handleAssignedToSelect })}
              renderNoItems={renderNoAssignedToItem({ handleAssignedToSelect })}
              handlePersonSelect={handleAssignedToSelect}
              personRecordHeightInRem={4.0625}
              AddingPersonForm={NewTaskDrawerInviteToListForm}
            />
          )}
          <StyledInput
            name="assignedToUserName"
            label="Assigned to"
            visible={!assignedToPopoverOpen}
            controlled
            fullWidth
            fontSize={16}
            labelFontSize={13}
            containerHeight={4.375}
            onContainerClick={() => {
              openAssignedToPopover();
            }}
            rightAdornment={<RightAdornment currentMember={currentMember} />}
          />
        </Grid>
      </FormContainer>
    </>
  );
};
