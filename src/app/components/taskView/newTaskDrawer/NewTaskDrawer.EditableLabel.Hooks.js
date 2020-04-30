/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { removeLabelFromDatabase } from 'actions/task-label-actions';

const initializeEditableLabelHooks = ({
  option,
  isInbox,
  setCurrentlyEditedOption,
}) => {
  const dispatch = useDispatch();

  const onEditClick = useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();
      setCurrentlyEditedOption(option);
    },
    [option, setCurrentlyEditedOption],
  );

  const onDeleteClick = useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();

      setCurrentlyEditedOption(null);

      removeLabelFromDatabase({ labelIdentifier: option?.value, isInbox })(
        dispatch,
      );
    },
    [dispatch, isInbox, option, setCurrentlyEditedOption],
  );

  return {
    onEditClick,
    onDeleteClick,
  };
};

export default initializeEditableLabelHooks;
