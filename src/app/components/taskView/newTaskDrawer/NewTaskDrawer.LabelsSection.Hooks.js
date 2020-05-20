/* eslint-disable react-hooks/rules-of-hooks */
import { useDispatch, useSelector } from 'react-redux';
import { prop } from 'ramda';
import { updateTaskManually } from 'actions/task-actions';
import {
  addLabel,
  editLabel,
  removeLabelForTask,
  getTaskListLabels,
} from 'actions/task-label-actions';

const labelAddOrRemovePromise = ({
  dispatch,
  taskIdentifier,
  currentLabelsIdentifiers,
  formattedLabelsIdentifiers,
}) => ({ labelIdentifier, labelName }) => {
  if (labelName === null || labelName === '') {
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

  const saveAddOrRemoveLabel = async selectedLabels => {
    // console.log('on add / remove labels');
    if (!selectedTask || !selectedTask.taskIdentifier) {
      // console.log('saving task');
      parentFormSubmit();
    }

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

    updateTaskManually({
      ...(selectedTask ?? {}),
      labels: formattedLabels,
    })(dispatch);
    getTaskListLabels({
      taskListIdentifier: selectedTask?.taskList?.taskListIdentifier,
    })(dispatch);

    setAutoSaveVisible();
  };

  const saveEditLabel = async (selectedLabel, newValue) => {
    const labelIdentifier = selectedLabel.value;
    const labelName = newValue;
    const taskIdentifier = selectedTask?.taskIdentifier;

    if (labelName === null || labelName === '') {
      return;
    }

    await editLabel({
      labelName,
      labelIdentifier,
      taskIdentifier,
    })(dispatch);

    getTaskListLabels({
      taskListIdentifier: selectedTask?.taskList?.taskListIdentifier,
    })(dispatch);

    setAutoSaveVisible();
  };

  const saveAddLabel = async newValue => {
    const labelIdentifier = undefined;
    const labelName = newValue;
    const taskIdentifier = selectedTask?.taskIdentifier;

    if (labelName === null || labelName === '') {
      return;
    }

    await addLabel({
      labelName,
      labelIdentifier,
      taskIdentifier,
    })(dispatch);

    getTaskListLabels({
      taskListIdentifier: selectedTask?.taskList?.taskListIdentifier,
    })(dispatch);

    setAutoSaveVisible();
  };

  return {
    labels,
    areLabelsRequested,
    saveAddOrRemoveLabel,
    saveEditLabel,
    saveAddLabel,
  };
};

export default initializeLabelsSectionHooks;
