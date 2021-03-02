/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { prop } from 'ramda';
import {
  addLabel,
  editLabel,
  removeLabelForTask,
  getTaskListLabels,
  removeLabelFromDatabase,
} from 'api/task-label-api';

import { refreshTask } from 'actions/task-actions';
import { getFormattedLabels } from './helpers';

const labelAddOrRemovePromise = ({
  taskIdentifier,
  currentLabelsIdentifiers,
  formattedLabelsIdentifiers,
}) => ({ labelIdentifier, labelName }) => {
  if (!labelName || labelName === null || labelName === '') {
    return Promise.resolve();
  }

  if (labelIdentifier === null) {
    return addLabel({ labelName, taskIdentifier });
  }

  if (
    !currentLabelsIdentifiers.includes(labelIdentifier) &&
    formattedLabelsIdentifiers.includes(labelIdentifier)
  ) {
    return addLabel({
      labelName,
      labelIdentifier,
      taskIdentifier,
    });
  }

  if (
    currentLabelsIdentifiers.includes(labelIdentifier) &&
    !formattedLabelsIdentifiers.includes(labelIdentifier)
  ) {
    return removeLabelForTask({
      labelName,
      labelIdentifier,
      taskIdentifier,
    });
  }

  return Promise.resolve();
};

const initializeLabelsSectionHooks = ({
  setAutoSaveVisible,
  setSelectedLabelsValue,
  onTaskUpdate,
  parentFormSubmit,
}) => {
  const dispatch = useDispatch();
  const { selectedTask } = useSelector(store => ({
    selectedTask: store.taskState.selectedTask,
  }));

  const [availableLabels, setAvailableLabels] = useState([]);
  const [isLoadingLabels, setIsLoadingLabels] = useState(false);

  const refreshLabels = async () => {
    if (selectedTask?.taskList?.taskListIdentifier) {
      setIsLoadingLabels(true);
      const freshLabels = await getTaskListLabels({
        taskListIdentifier: selectedTask?.taskList?.taskListIdentifier,
      });

      setAvailableLabels(freshLabels);
      setIsLoadingLabels(false);
    }

    const refreshedTask = await refreshTask(selectedTask)(dispatch);

    setSelectedLabelsValue(
      'labels',
      getFormattedLabels({ labels: refreshedTask?.labels ?? [] }),
    );
    onTaskUpdate(refreshedTask);
  };

  const saveAddOrRemoveLabel = async selectedLabels => {
    const currentLabels = selectedTask?.labels ?? [];
    const currentLabelsIdentifiers = currentLabels.map(prop('labelIdentifier'));

    const formattedLabels = (selectedLabels ?? []).map(
      ({ value, displayLabel }) => ({
        labelIdentifier: value,
        labelName: displayLabel,
      }),
    );

    const allLabels = [...currentLabels, ...formattedLabels];
    const formattedLabelsIdentifiers = formattedLabels.map(
      prop('labelIdentifier'),
    );
    const taskIdentifier = selectedTask?.taskIdentifier;

    await Promise.all(
      allLabels.map(
        labelAddOrRemovePromise({
          taskIdentifier,
          currentLabelsIdentifiers,
          formattedLabelsIdentifiers,
        }),
      ),
    );

    setAutoSaveVisible();
    refreshLabels();
  };

  const saveAddLabel = async selectedLabel => {
    const labelIdentifier = selectedLabel?.labelIdentifier;
    const labelName = selectedLabel?.labelName;
    const taskIdentifier = selectedTask?.taskIdentifier;

    if (!labelName || labelName === null || labelName === '') {
      return;
    }

    await addLabel({
      labelName,
      labelIdentifier,
      taskIdentifier,
    });

    setAutoSaveVisible();
    refreshLabels();
  };

  const saveAddLabelWithNewValue = async newValue => {
    const labelIdentifier = undefined;
    const labelName = newValue;
    const taskIdentifier = selectedTask?.taskIdentifier;

    if (!labelName || labelName === null || labelName === '') {
      return;
    }

    await addLabel({
      labelName,
      labelIdentifier,
      taskIdentifier,
    });

    setAutoSaveVisible();
    refreshLabels();
  };

  const saveEditLabel = async (labelIdentifier, newValue) => {
    const labelName = newValue;
    const taskIdentifier = selectedTask?.taskIdentifier;

    if (!labelName || labelName === null || labelName === '') {
      return;
    }

    await editLabel({
      labelName,
      labelIdentifier,
      taskIdentifier,
    });

    setAutoSaveVisible();
    refreshLabels();
  };

  const removeLabelFromTask = async selectedLabel => {
    const labelIdentifier = selectedLabel?.labelIdentifier;
    const labelName = selectedLabel?.labelName;
    const taskIdentifier = selectedTask?.taskIdentifier;

    await removeLabelForTask({
      labelName,
      labelIdentifier,
      taskIdentifier,
    });

    setAutoSaveVisible();
    refreshLabels();
  };

  const deleteLabel = async selectedLabel => {
    const labelIdentifier = selectedLabel?.labelIdentifier;

    await removeLabelFromDatabase({
      labelIdentifier,
    });

    refreshLabels();
  };

  const saveTaskOnFocus = async () => {
    if (!selectedTask || !selectedTask.taskIdentifier) {
      parentFormSubmit();
    }
  };

  return {
    labels: availableLabels,
    isLoadingLabels,
    saveAddOrRemoveLabel,
    saveAddLabel,
    saveAddLabelWithNewValue,
    saveEditLabel,
    removeLabelFromTask,
    refreshLabels,
    deleteLabel,
    saveTaskOnFocus,
  };
};

export default initializeLabelsSectionHooks;
