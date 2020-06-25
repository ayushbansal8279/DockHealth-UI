import React from 'react';
import moment from 'moment';
import Circle from 'img/circle';
import HighPriorityLabel from 'img/priority-high-label-icon.svg';
import LowPriorityHoverLabel from 'img/priority-label-hover-icon.svg';
import {
  CircleIcon,
  OverdueBar,
  DashboardTaskItemContainer,
  DashboardTaskItemRow,
  DashboardTaskItemDescription,
  DashboardTaskItemParentTaskLabel,
  DashboardTaskItemRightSide,
  DashboardTaskItemListLink,
  PrioritySwitch,
  PriorityHoverIcon,
} from './styled';

const DashboardTaskItem = ({
  description,
  taskList,
  dueDate,
  priority,
  parentTask,
}) => {
  return (
    <DashboardTaskItemContainer>
      <PrioritySwitch onClick={() => {}}>
        {priority === 'HIGH' ? (
          <img src={HighPriorityLabel} alt="Priority icon" />
        ) : (
          <PriorityHoverIcon
            className="low"
            src={LowPriorityHoverLabel}
            alt="No priority"
          />
        )}
      </PrioritySwitch>
      <CircleIcon src={Circle} />
      <DashboardTaskItemRow>
        <DashboardTaskItemDescription>
          <span>{description}</span>
          {parentTask && (
            <DashboardTaskItemParentTaskLabel>
              Subtask of <span>{parentTask.description}</span>
            </DashboardTaskItemParentTaskLabel>
          )}
        </DashboardTaskItemDescription>
        <DashboardTaskItemRightSide>
          {taskList && (
            <DashboardTaskItemListLink
              to={`tasks/${taskList?.taskListIdentifier}`}
            >
              {taskList?.listName}
            </DashboardTaskItemListLink>
          )}
          {dueDate && moment(new Date()).isAfter(dueDate) && (
            <OverdueBar>Overdue</OverdueBar>
          )}
        </DashboardTaskItemRightSide>
      </DashboardTaskItemRow>
    </DashboardTaskItemContainer>
  );
};

export default DashboardTaskItem;
