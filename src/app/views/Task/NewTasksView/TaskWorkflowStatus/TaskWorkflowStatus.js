import React, { useRef, useState } from 'react';
import {
  StyledPopover,
  Box,
  StatusBox,
  StatusList,
  StatusLabelContainer,
  StatusFlag,
} from './styled';

import { STATUSES } from '../../../../components/taskView/newTaskDrawer/NewTaskDrawer.StatusSection.Hooks';

import { CondensedH4 } from '../../../../components/taskView/newTaskDrawer/NewTaskDrawer.Styled';

const TaskWorkflowStatus = ({
  children,
  task,
  isCompletedGroup,
  updateWorkflowStatus,
}) => {
  const assignWorkflowStatusReference = useRef(null);
  const [isOpen, openPopover] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          if (!isCompletedGroup) openPopover(true);
        }}
        style={{ cursor: 'pointer', height: '100%' }}
        ref={assignWorkflowStatusReference}
      >
        {children}
      </div>
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
