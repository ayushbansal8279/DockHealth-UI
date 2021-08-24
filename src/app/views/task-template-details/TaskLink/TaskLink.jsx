import React, { useRef } from 'react';
import { isNil } from 'ramda';
import useBoolean from 'hooks/useBoolean';
import { useDispatch } from 'react-redux';
import { MenuItem, Paper, MenuList } from '@material-ui/core';
import { deleteTasksLink, updateTasksLink } from 'actions/task-actions';
import HardDependencyIcon from 'img/template/hard-dependency';
import CalendarIcon from 'img/template/calendar-icon';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { getEdgeCenter } from 'react-flow-renderer';
import LinkPath from '../LinkPath/LinkPath';
import {
  LabelsWrapper,
  HardDependencyLabel,
  MenuWrapper,
  useMenuStyles,
  MenuItemIconWrapper,
  DelayPeriodPopoverWrapper,
  DelayPeriodLabel,
} from './styled';
import TaskLinkDelayPopover from './TaskLinkDelayPopover';

const TaskLink = props => {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    source: sourceTaskIdentifier,
    target: targetTaskIdentifier,
    sourcePosition,
    targetPosition,
    selected,
    data: { link },
  } = props;
  const { isDependent, delayPeriod, delayPeriodUnit } = link || {};
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  const labelWrapperReference = useRef(null);
  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);
  const menuClasses = useMenuStyles();
  const dispatch = useDispatch();
  const delayOptionsVisible = !isNil(delayPeriod) && delayPeriodUnit;

  const toggleDependent = () => {
    dispatch(updateTasksLink({ ...link, isDependent: !isDependent }));
  };

  const removeDelayPeriod = () => {
    dispatch(
      updateTasksLink({
        ...link,
        delayPeriod: null,
        delayPeriodUnit: null,
        delayIsBusinessDays: null,
      }),
    );
  };

  const handleDelayPeriodToggle = () => {
    if (delayOptionsVisible) {
      removeDelayPeriod();
    } else {
      openPopover();
    }
  };

  const deleteLink = () => {
    dispatch(deleteTasksLink(sourceTaskIdentifier, targetTaskIdentifier));
  };

  return (
    <>
      <LinkPath {...props} />
      <foreignObject
        width={160}
        height={32}
        x={edgeCenterX - 160 / 2}
        y={edgeCenterY - 32 / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
        style={{ overflow: 'visible' }}
      >
        <LabelsWrapper ref={labelWrapperReference}>
          {delayOptionsVisible && (
            <DelayPeriodLabel onClick={openPopover}>
              {delayPeriod} {delayPeriodUnit.toLowerCase()}
              {delayPeriod > 1 ? 's' : ''}
            </DelayPeriodLabel>
          )}
          {isDependent && (
            <HardDependencyLabel>
              <HardDependencyIcon />
            </HardDependencyLabel>
          )}
          {isPopoverOpen && (
            <DelayPeriodPopoverWrapper>
              <TaskLinkDelayPopover
                anchorEl={labelWrapperReference.current}
                link={link}
                onClose={closePopover}
              />
            </DelayPeriodPopoverWrapper>
          )}
          {selected && (
            <MenuWrapper>
              <Paper>
                <MenuList classes={menuClasses}>
                  <MenuItem onClick={toggleDependent}>
                    <MenuItemIconWrapper>
                      <HardDependencyIcon size={11} />
                    </MenuItemIconWrapper>
                    {isDependent ? 'Remove' : 'Make'} dependent
                  </MenuItem>
                  <MenuItem onClick={handleDelayPeriodToggle}>
                    <MenuItemIconWrapper>
                      <CalendarIcon size={11} />
                    </MenuItemIconWrapper>
                    {delayPeriod && delayPeriodUnit ? 'Remove' : 'Add'} time
                    till task
                  </MenuItem>
                  <MenuItem onClick={deleteLink}>
                    <MenuItemIconWrapper>
                      <DeleteOutlineIcon style={{ height: 13 }} />
                    </MenuItemIconWrapper>
                    Delete link
                  </MenuItem>
                </MenuList>
              </Paper>
            </MenuWrapper>
          )}
        </LabelsWrapper>
      </foreignObject>
    </>
  );
};

export default TaskLink;
