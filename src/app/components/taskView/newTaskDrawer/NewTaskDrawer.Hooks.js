/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import { object, string } from 'yup';

import { getAllPatients } from 'actions/patient-actions';
import { saveTask, storeAsCurrentTask } from 'actions/task-actions';
import { closeDrawer } from 'actions/task-drawer-actions';
import Member from 'components/members/Member';

import { MemberAdornmentContainer } from './NewTaskDrawer.Styled';

const REQUIRED_MESSAGE = 'This field is required';

const validationSchema = object().shape({
  description: string().required(REQUIRED_MESSAGE),
});

const initializeTaskDrawerHooks = ({ members }) => {
  const {
    patients,
    taskDrawerOpen,
    selectedTask,
    addingNewSubtask,
    tasks,
  } = useSelector(store => ({
    taskDrawerOpen: store.taskDrawerState.open,
    patients: store.patientState.allPatients,
    selectedTask: store.taskState.selectedTask,
    addingNewSubtask: store.taskState.addingNewSubtask,
    tasks: store.taskState.tasks,
  }));

  const [isSaving, setSaving] = useState(false);

  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  const { setValue, watch } = formMethods;

  const selectedTaskIdentifier = selectedTask?.taskIdentifier;
  const selectedTaskParent = useMemo(
    () =>
      tasks?.find(
        ({ taskIdentifier }) =>
          taskIdentifier === selectedTask?.parentTaskIdentifier,
      ) ?? null,
    [selectedTask, tasks],
  );

  const isAddingOrEditingSubtask =
    Boolean(selectedTaskParent) || addingNewSubtask;

  useEffect(() => {
    setValue('description', selectedTask?.description ?? null);
    setValue(
      'patientIdentifier',
      selectedTask?.patient?.patientIdentifier ??
        selectedTaskParent?.patient?.patientIdentifier ??
        null,
    );
    setValue(
      'assignedToIdentifier',
      selectedTask?.assignedTo?.userIdentifier ?? null,
    );
    setValue('dueDate', selectedTask?.dueDate ?? null);
    setValue('priority', selectedTask?.priority ?? null);
    setValue('workflowStatus', selectedTask?.workflowStatus ?? null);
    // Exhaustive deps are disabled due to selectedTask referential inequality triggerting useEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTaskIdentifier, setValue, taskDrawerOpen]);

  const { top } =
    document.querySelector('#content-container')?.getBoundingClientRect() || {};

  const dispatch = useDispatch();

  useMount(() => {
    getAllPatients()(dispatch);
  });

  const closeTaskDrawer = useCallback(() => {
    closeDrawer()(dispatch);
    storeAsCurrentTask(null)(dispatch);
  }, [dispatch]);

  const onSubmit = useCallback(
    data => {
      const requestData = {
        ...(selectedTask ?? {}),
        ...data,
      };

      setSaving(true);

      saveTask(requestData)(dispatch)
        .then(() => {
          setSaving(false);
        })
        .catch(() => {
          setSaving(false);
        });
    },
    [dispatch, selectedTask],
  );

  const currentAssignedToValue = watch('assignedToIdentifier');
  const currentAssignedToAdornment = useMemo(() => {
    const currentMember = members?.find(
      ({ userIdentifier }) => currentAssignedToValue === userIdentifier,
    );
    return currentMember ? (
      <MemberAdornmentContainer>
        <Member showTooltip={false} member={currentMember} size={30} />
      </MemberAdornmentContainer>
    ) : null;
  }, [currentAssignedToValue, members]);

  return {
    taskDrawerOpen,
    top,
    onSubmit,
    formMethods,
    isAddingOrEditingSubtask,
    patients,
    currentAssignedToAdornment,
    closeTaskDrawer,
    isSaving,
  };
};

export default initializeTaskDrawerHooks;
