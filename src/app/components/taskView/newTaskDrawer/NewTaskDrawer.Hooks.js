/* eslint-disable react-hooks/rules-of-hooks */
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import { object, string } from 'yup';

import { getAllPatients } from 'actions/patient-actions';
import {
  saveTask,
  storeAsCurrentTask,
  updateTaskManually,
} from 'actions/task-actions';
import { closeDrawer } from 'actions/task-drawer-actions';
import { addLabel, removeLabelForTask } from 'actions/task-label-actions';
import Member from 'components/members/Member';

import { prop } from 'ramda';
import { MemberAdornmentContainer } from './NewTaskDrawer.Styled';
import { getFormattedLabels } from './NewTaskDrawer.Utilities';

const REQUIRED_MESSAGE = 'This field is required';
const TIME_12H_FORMAT_REGULAR_EXPRESSION = /^(1[0-2]|0{0,1}[1-9]):([0-5]\d) [APap][Mm]$/;
const DATE_ISO_FORMAT = 'YYYY-MM-DD';
const TIME_12H_FORMAT = 'h:mm A';
const DATETIME_FULL_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss.SSSZ';

const validationSchema = object().shape({
  description: string().required(REQUIRED_MESSAGE),
  dueTime: string().matches(TIME_12H_FORMAT_REGULAR_EXPRESSION, {
    excludeEmptyString: true,
    message: 'Time should be provided in HH:MM PM/AM format',
  }),
});

const mapLabelsPromises = ({
  dispatch,
  taskIdentifier,
  currentLabelsIdentifiers,
  formattedLabelsIdentifiers,
}) => ({ labelIdentifier, labelName }) => {
  if (labelIdentifier === null) {
    return addLabel({ labelName, taskIdentifier })(dispatch);
  }

  if (
    !currentLabelsIdentifiers.includes(labelIdentifier) &&
    formattedLabelsIdentifiers.includes(labelIdentifier)
  ) {
    return addLabel({
      labelName,
      labelIdentifier,
      taskIdentifier,
    })(dispatch);
  }

  if (
    currentLabelsIdentifiers.includes(labelIdentifier) &&
    !formattedLabelsIdentifiers.includes(labelIdentifier)
  ) {
    return removeLabelForTask({
      labelName,
      labelIdentifier,
      taskIdentifier,
    })(dispatch);
  }

  return Promise.resolve();
};

const onSubmit = ({ selectedTask, dispatch, setSaving }) => data => {
  const currentLabels = selectedTask?.labels ?? [];
  const currentLabelsIdentifiers = currentLabels.map(prop('labelIdentifier'));

  const formattedLabels = (data.labels ?? []).map(
    ({ value, displayLabel }) => ({
      labelIdentifier: value,
      labelName: displayLabel,
    }),
  );

  const allLabels = [...currentLabels, ...formattedLabels];

  const formattedLabelsIdentifiers = formattedLabels.map(
    prop('labelIdentifier'),
  );

  const requestData = {
    ...(selectedTask ?? {}),
    ...data,
    labels: [],
  };

  const dueDate = moment(requestData.dueDate);
  const dueTime = moment(requestData.dueTime, TIME_12H_FORMAT);

  if (dueTime.isValid()) {
    dueDate.set({
      hour: dueTime.hour(),
      minute: dueTime.minute(),
    });
  }

  requestData.dueDate = dueDate.isValid()
    ? dueDate.format(DATETIME_FULL_FORMAT)
    : null;
  delete requestData.dueTime;

  setSaving(true);

  saveTask(requestData)(dispatch)
    .then(async response => {
      const taskIdentifier = response?.taskIdentifier;

      if (!taskIdentifier) return;

      await Promise.all(
        allLabels.map(
          mapLabelsPromises({
            dispatch,
            taskIdentifier,
            currentLabelsIdentifiers,
            formattedLabelsIdentifiers,
          }),
        ),
      );

      updateTaskManually({
        ...(selectedTask ?? {}),
        ...data,
        labels: formattedLabels,
      })(dispatch);

      setSaving(false);
    })
    .catch(() => {
      setSaving(false);
    });
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const initializeTaskDrawerHooks = ({ members, isInbox }) => {
  const {
    patients,
    taskDrawerOpen,
    selectedTask,
    addingNewSubtask,
    tasks,
    labels,
    areLabelsRequested,
  } = useSelector(store => ({
    taskDrawerOpen: store.taskDrawerState.open,
    patients: store.patientState.allPatients,
    selectedTask: store.taskState.selectedTask,
    addingNewSubtask: store.taskState.addingNewSubtask,
    tasks: store.taskState.tasks,
    labels: isInbox
      ? store.taskLabelState.data.inboxLabels
      : store.taskLabelState.data.listLabels,
    areLabelsRequested: isInbox
      ? store.taskLabelState.requesting.inboxLabels
      : store.taskLabelState.requesting.listLabels,
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
    const dueDateMoment = moment(selectedTask?.dueDate ?? null);

    if (dueDateMoment.isValid()) {
      setValue('dueDate', dueDateMoment.format(DATE_ISO_FORMAT));
      setValue('dueTime', dueDateMoment.format(TIME_12H_FORMAT));
    } else {
      setValue('dueDate', null);
      setValue('dueTime', null);
    }

    setValue('priority', selectedTask?.priority ?? null);
    setValue('workflowStatus', selectedTask?.workflowStatus ?? null);
    setValue(
      'labels',
      getFormattedLabels({ labels: selectedTask?.labels ?? [] }),
    );
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
    selectedTask,
    labels,
    areLabelsRequested,
    taskDrawerOpen,
    top,
    onSubmit: onSubmit({ selectedTask, dispatch, setSaving }),
    formMethods,
    isAddingOrEditingSubtask,
    patients,
    currentAssignedToAdornment,
    closeTaskDrawer,
    isSaving,
  };
};

export default initializeTaskDrawerHooks;
