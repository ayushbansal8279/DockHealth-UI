/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { removeLabelFromDatabase } from 'actions/task-label-actions';

const initializeEditableLabelHooks = ({
  option,
  isInbox,
  setCurrentlyEditedOption,
  setEditing,
  enableForceOpen,
  setAutoSaveVisible,
  refreshLabels,
}) => {
  const dispatch = useDispatch();

  const onEditClick = useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();
      setCurrentlyEditedOption(option);
      setEditing();
      enableForceOpen();
    },
    [enableForceOpen, option, setCurrentlyEditedOption, setEditing],
  );

  const onDeleteClick = useCallback(
    async event => {
      event.preventDefault();
      event.stopPropagation();

      setCurrentlyEditedOption(null);

      await removeLabelFromDatabase({
        labelIdentifier: option?.value,
        isInbox,
      })(dispatch);

      setAutoSaveVisible();

      refreshLabels();
    },
    [
      dispatch,
      isInbox,
      option,
      refreshLabels,
      setAutoSaveVisible,
      setCurrentlyEditedOption,
    ],
  );

  return {
    onEditClick,
    onDeleteClick,
  };
};

export default initializeEditableLabelHooks;
