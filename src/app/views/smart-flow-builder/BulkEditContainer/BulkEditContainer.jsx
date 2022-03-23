import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { currentTaskTemplateIdentifierSelector } from 'selectors/task-template-selectors';
import * as TaskTemplateActions from 'actions/task-template-actions';
import { AnimatePresence } from 'framer-motion/dist/framer-motion';
import { BulkEditOptionsConfig } from 'helpers/bulk-edit-helpers';
import BulkEditOptionsBar from 'components/tasklist/BulkEditSection/BulkEditOptionsBar/BulkEditOptionsBar';
import { AnimatedContainer } from './styled';

const SMARTFLOW_BULK_EDIT_CONFIG = {
  [BulkEditOptionsConfig.DUPLICATE_OPTION]: true,
  [BulkEditOptionsConfig.MOVE_OPTION]: false,
  [BulkEditOptionsConfig.COMPLETE_OPTION]: false,
  [BulkEditOptionsConfig.STATUS_OPTION]: true,
  [BulkEditOptionsConfig.DUE_DATE_OPTION]: false,
  [BulkEditOptionsConfig.ASSIGN_OPTION]: true,
  [BulkEditOptionsConfig.DELETE_OPTION]: false,
};

const BulkEditContainer = props => {
  const { selectedTasks, onClose } = props;

  const dispatch = useDispatch();
  const currentWorkflowIdentifier = useSelector(
    currentTaskTemplateIdentifierSelector,
  );

  const formattedSelectedTasks = useMemo(
    () => ({ parentTasks: selectedTasks }),
    [selectedTasks],
  );

  const handleRefresh = () => {
    dispatch(
      TaskTemplateActions.getTemplateTasks(currentWorkflowIdentifier, false),
    );
  };

  return (
    <AnimatePresence initial={false}>
      {selectedTasks?.length > 0 && (
        <AnimatedContainer
          initial={{ translateX: '-50%', translateY: '100%' }}
          animate={{ translateX: '-50%', translateY: 0 }}
          exit={{ translateX: '-50%', translateY: '100%' }}
          transition={{ duration: 0.3, bounce: 0 }}
        >
          <BulkEditOptionsBar
            selectedTasks={formattedSelectedTasks}
            onClose={onClose}
            refreshTasks={handleRefresh}
            optionsConfig={SMARTFLOW_BULK_EDIT_CONFIG}
          />
        </AnimatedContainer>
      )}
    </AnimatePresence>
  );
};

export default BulkEditContainer;
