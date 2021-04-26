/* eslint-disable react-hooks/rules-of-hooks */
import React, { useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import useBoolean from 'hooks/useBoolean';
import palette from 'styles/palette';
import {
  taskTemplatesSelector,
  isFetchingTaskTemplatesSelector,
} from 'selectors/task-template-selectors';
import Spacing from 'components/common/Spacing';
import { RotatableHeaderChevron } from 'components/common/RotatableChevron/RotatableChevron';
import TaskTemplatePopover from './TaskTemplatePopover';
import {
  TaskTemplateApplicatorContainer,
  TaskTemplateApplicatorLabel,
} from './styled';

const TaskTemplateApplicator = ({ onTemplateSelect }) => {
  const taskTemplates = useSelector(taskTemplatesSelector);
  const taskTemplatesIsLoading = useSelector(isFetchingTaskTemplatesSelector);
  const popoverReference = useRef(null);
  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);

  const taskTemplatesList = useMemo(
    () =>
      taskTemplates?.map(template => ({
        key: template?.taskTemplateIdentifier,
        label: template?.name,
        onClick: () => {
          onTemplateSelect(template);
          closePopover();
        },
      })),
    [closePopover, onTemplateSelect, taskTemplates],
  );

  return (
    <>
      <TaskTemplateApplicatorContainer
        onClick={openPopover}
        ref={popoverReference}
      >
        <TaskTemplateApplicatorLabel>
          Use a workflow
        </TaskTemplateApplicatorLabel>
        <Spacing horizontal={3} />
        <RotatableHeaderChevron
          rotated={isPopoverOpen}
          color={palette.oPlusRed}
        />
      </TaskTemplateApplicatorContainer>
      <TaskTemplatePopover
        anchorEl={popoverReference.current}
        open={isPopoverOpen}
        onClose={closePopover}
        taskTemplatesList={taskTemplatesList}
        taskTemplatesIsLoading={taskTemplatesIsLoading}
      />
    </>
  );
};

export default TaskTemplateApplicator;
