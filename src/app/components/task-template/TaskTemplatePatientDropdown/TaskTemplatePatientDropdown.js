import React, { useRef } from 'react';
import TaskTemplatePatientList from './TaskTemplatePatientList';
import { StyledPopover } from './styled';

const TaskTemplatePatientDropdown = ({
  children,
  taskGroupIdentifier,
  templateBundleIdentifier,
  selectedPatientIdentifier,
  openPopover,
  closePopover,
  isPopoverOpen,
}) => {
  const popoverReference = useRef(null);

  return (
    <>
      <div onClick={openPopover} ref={popoverReference}>
        {children}
      </div>
      <StyledPopover
        anchorEl={popoverReference?.current}
        open={isPopoverOpen}
        onClose={() => closePopover(false)}
        width="440"
      >
        <TaskTemplatePatientList
          taskGroupIdentifier={taskGroupIdentifier}
          templateBundleIdentifier={templateBundleIdentifier}
          selectedPatientIdentifier={selectedPatientIdentifier}
        />
      </StyledPopover>
    </>
  );
};

export default TaskTemplatePatientDropdown;
