/* eslint-disable react-hooks/rules-of-hooks */
import React, { useRef } from 'react';
import useBoolean from 'hooks/useBoolean';
import { MoreVert } from '@material-ui/icons';
import TaskTemplateGroupPopover from './TaskTemplateOptionsPopover';

const TaskTemplateOptions = ({
  templateBundleIdentifier,
  taskGroupIdentifier,
}) => {
  const popoverReference = useRef(null);
  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);
  return (
    <>
      <MoreVert
        fontSize="large"
        color="inherit"
        onClick={openPopover}
        ref={popoverReference}
        taskGroupIdentifier={taskGroupIdentifier}
        templateBundleIdentifier={templateBundleIdentifier}
      />
      <TaskTemplateGroupPopover
        anchorEl={popoverReference.current}
        open={isPopoverOpen}
        onClose={closePopover}
        taskGroupIdentifier={taskGroupIdentifier}
        templateBundleIdentifier={templateBundleIdentifier}
      />
    </>
  );
};

export default TaskTemplateOptions;
