import React, { useMemo, useEffect } from 'react';

import SelectDestinationModal from './SelectDestinationModal';

const SelectTaskDestinationModal = props => {
  const {
    closeModal,
    tasksToMove = [],
    // eslint-disable-next-line sonarjs/cognitive-complexity
  } = props;

  const [subtasksPresent, allTasksSameType] = useMemo(() => {
    let allSameType = true;
    let hasSubtasks = false;

    for (let i = 0; i < tasksToMove.length; i += 1) {
      if (!hasSubtasks) {
        hasSubtasks = !!tasksToMove[i].parentTaskIdentifier;
      }

      if (i !== 0) {
        allSameType =
          !!tasksToMove[i].parentTaskIdentifier ===
          !!tasksToMove[i - 1].parentTaskIdentifier;

        if (!allSameType) {
          break;
        }
      }
    }

    return [hasSubtasks, allSameType];
  }, [tasksToMove]);

  useEffect(() => {
    if (!allTasksSameType) {
      closeModal();
    }
  }, [allTasksSameType, closeModal]);

  return (
    <SelectDestinationModal {...props} selectParentTask={subtasksPresent} />
  );
};

export default SelectTaskDestinationModal;
