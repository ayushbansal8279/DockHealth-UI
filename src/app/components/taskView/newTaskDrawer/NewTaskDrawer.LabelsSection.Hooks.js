/* eslint-disable react-hooks/rules-of-hooks */
import { useDispatch, useSelector } from 'react-redux';
import { prop } from 'ramda';
import {
  addLabel,
  editLabel,
  removeLabelForTask,
  getTaskListLabels,
} from 'actions/task-label-actions';
import { refreshTask } from 'actions/task-actions';
import { getFormattedLabels } from './NewTaskDrawer.Utilities';

const labelAddOrRemovePromise = ({
  dispatch,
  taskIdentifier,
  currentLabelsIdentifiers,
  formattedLabelsIdentifiers,
}) => ({ labelIdentifier, labelName }) => {
  if (!labelName || labelName === null || labelName === '') {
    return Promise.resolve();
  }

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

const initializeLabelsSectionHooks = ({
  isInbox,
  parentFormSubmit,
  setAutoSaveVisible,
  setSelectedLabelsValue,
}) => {
  const { selectedTask, labels, areLabelsRequested } = useSelector(store => ({
    selectedTask: store.taskState.selectedTask,
    labels: isInbox
      ? store.taskLabelState.data.inboxLabels
      : store.taskLabelState.data.listLabels,
    areLabelsRequested: isInbox
      ? store.taskLabelState.requesting.inboxLabels
      : store.taskLabelState.requesting.listLabels,
  }));

  const dispatch = useDispatch();

  const refreshLabels = async () => {
    getTaskListLabels({
      taskListIdentifier: selectedTask?.taskList?.taskListIdentifier,
    })(dispatch);

    const refreshedTask = await refreshTask(selectedTask)(dispatch);

    setSelectedLabelsValue(
      'labels',
      getFormattedLabels({ labels: refreshedTask?.labels ?? [] }),
    );
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
          dispatch,
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
    const labelIdentifier = selectedLabel?.value;
    const labelName = selectedLabel?.displayLabel;
    const taskIdentifier = selectedTask?.taskIdentifier;

    if (!labelName || labelName === null || labelName === '') {
      return;
    }

    await addLabel({
      labelName,
      labelIdentifier,
      taskIdentifier,
    })(dispatch);

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
    })(dispatch);

    setAutoSaveVisible();
    refreshLabels();
  };

  const saveEditLabel = async (selectedLabel, newValue) => {
    const labelIdentifier = selectedLabel.value;
    const labelName = newValue;
    const taskIdentifier = selectedTask?.taskIdentifier;

    if (!labelName || labelName === null || labelName === '') {
      return;
    }

    await editLabel({
      labelName,
      labelIdentifier,
      taskIdentifier,
    })(dispatch);

    setAutoSaveVisible();
    refreshLabels();
  };

  const removeLabelFromTask = async selectedLabel => {
    const labelIdentifier = selectedLabel?.value;
    const labelName = selectedLabel?.displayLabel;
    const taskIdentifier = selectedTask?.taskIdentifier;

    await removeLabelForTask({
      labelName,
      labelIdentifier,
      taskIdentifier,
    })(dispatch);

    setAutoSaveVisible();
    refreshLabels();
  };

  const saveTaskOnFocus = async () => {
    if (!selectedTask || !selectedTask.taskIdentifier) {
      parentFormSubmit();
    }
  };

  return {
    labels,
    areLabelsRequested,
    saveAddOrRemoveLabel,
    saveAddLabel,
    saveAddLabelWithNewValue,
    saveEditLabel,
    removeLabelFromTask,
    saveTaskOnFocus,
    refreshLabels,
  };
};

export default initializeLabelsSectionHooks;
