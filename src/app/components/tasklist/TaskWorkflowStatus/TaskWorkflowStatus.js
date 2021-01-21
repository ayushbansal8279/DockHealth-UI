import React, { useRef, useState } from 'react';
import { STATUSES } from 'components/taskView/newTaskDrawer/NewTaskDrawer.StatusSection.Hooks';
import { CondensedH4 } from 'components/taskView/newTaskDrawer/NewTaskDrawer.Styled';
import {
  StyledPopover,
  Box,
  StatusBox,
  StatusList,
  StatusLabelContainer,
  StatusFlag,
  Button,
} from './styled';

const TaskWorkflowStatus = ({
  children,
  task,
  isCompletedGroup,
  updateWorkflowStatus,
  isDisabled,
}) => {
  const assignWorkflowStatusReference = useRef(null);
  const [isOpen, openPopover] = useState(false);

  return (
    <>
      <Button
        type="button"
        onClick={() => {
          if (!isCompletedGroup) openPopover(true);
        }}
        ref={assignWorkflowStatusReference}
        disabled={isDisabled}
      >
        {children}
      </Button>
      <StyledPopover
        anchorEl={assignWorkflowStatusReference?.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isOpen}
        onClose={() => openPopover(false)}
      >
        <Box>
          <StatusBox>
            <StatusList>
              {STATUSES?.map(({ value, label, color }) => (
                <StatusLabelContainer
                  key={value}
                  onClick={() => {
                    updateWorkflowStatus(task, value);
                    openPopover(false);
                  }}
                >
                  <StatusFlag color={color} />
                  <CondensedH4>{label}</CondensedH4>
                </StatusLabelContainer>
              ))}
            </StatusList>
          </StatusBox>
        </Box>
      </StyledPopover>
    </>
  );
};
export default TaskWorkflowStatus;
