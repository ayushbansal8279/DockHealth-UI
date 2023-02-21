/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import prop from 'ramda/src/prop';
import { checkIfTemplateTask } from 'helpers/task-helpers';
import {
  addLabel,
  editLabel,
  removeLabelForTask,
  getTaskListLabels,
  getTemplateLabels,
  removeLabelFromDatabase,
} from 'api/task-label-api';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { refreshTask } from 'actions/task-actions';
import AlertMessages from 'alert/AlertMessages';
import * as AlertActions from 'alert/actions';
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
  onTaskUpdate,
  formMethods: { setValue },
}) => {
  const dispatch = useDispatch();
  const selectedTask = useSelector(selectedTaskSelector);
  const isTemplateTask = checkIfTemplateTask(selectedTask);
  const [availableLabels, setAvailableLabels] = useState([]);
  const [isLoadingLabels, setIsLoadingLabels] = useState(false);

  const setAutoSaveVisible = useCallback(() => {
    dispatch(AlertActions.showSideBarAlert(AlertMessages.SAVED));
  }, [dispatch]);

  const refreshLabels = async () => {
    setIsLoadingLabels(true);
    const freshLabels = isTemplateTask
      ? await getTemplateLabels()
      : await getTaskListLabels({
          taskListIdentifier: selectedTask?.taskList?.taskListIdentifier,
        });

    setAvailableLabels(freshLabels);
    setIsLoadingLabels(false);
    setValue(
      'labels',
      getFormattedLabels({ labels: selectedTask?.labels ?? [] }),
    );
    const refreshedTask = await refreshTask(selectedTask.identifier)(dispatch);

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
  };
};

export default initializeLabelsSectionHooks;
