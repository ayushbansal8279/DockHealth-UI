/* eslint-disable sonarjs/cognitive-complexity */
import React, { useRef, useEffect } from 'react';
import { isNil } from 'ramda';
import useBoolean from 'hooks/useBoolean';
import { useDispatch } from 'react-redux';
import {
  MenuItem,
  Paper,
  MenuList,
  Popper,
  ClickAwayListener,
} from '@material-ui/core';
import { deleteTasksLink, updateTasksLink } from 'actions/task-actions';
import HardDependencyIcon from 'img/template/hard-dependency';
import CalendarIcon from 'img/template/calendar-icon';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { getEdgeCenter, useStoreState } from 'react-flow-renderer';
import LinkPath from '../LinkPath/LinkPath';
import {
  LabelsWrapper,
  HardDependencyLabel,
  useMenuStyles,
  MenuItemIconWrapper,
  DelayPeriodLabel,
} from './styled';
import TaskLinkDelayForm from './TaskLinkDelayForm';

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
  const { 2: zoom } = useStoreState(store => store.transform);
  const labelWrapperReference = useRef(null);
  const [isDelayPopoverOpen, openDelayPopover, closeDelayPopover] = useBoolean(
    false,
  );
  const [areOptionsOpen, openOptions, closeOptions] = useBoolean(false);
  const menuClasses = useMenuStyles();
  const dispatch = useDispatch();
  const delayOptionsVisible = !isNil(delayPeriod) && delayPeriodUnit;

  useEffect(() => {
    if (!isDependent && selected) {
      openOptions();
    }
  }, [isDependent, openOptions, selected]);

  const toggleDependent = () => {
    dispatch(
      updateTasksLink({
        ...link,
        isDependent: !isDependent,
        delayPeriod: null,
        delayPeriodUnit: null,
        delayIsBusinessDays: null,
      }),
    );
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
      openDelayPopover();
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
            <DelayPeriodLabel onClick={openDelayPopover}>
              {delayPeriod} {delayPeriodUnit.toLowerCase()}
              {delayPeriod > 1 ? 's' : ''}
            </DelayPeriodLabel>
          )}
          {isDependent && (
            <HardDependencyLabel onClick={openOptions}>
              <HardDependencyIcon />
            </HardDependencyLabel>
          )}
        </LabelsWrapper>
        {isDelayPopoverOpen && (
          <Popper
            anchorEl={labelWrapperReference.current}
            placement="bottom-end"
            open
            style={{ zIndex: 10 }}
          >
            <ClickAwayListener onClickAway={closeDelayPopover}>
              <Paper
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top right',
                }}
              >
                <TaskLinkDelayForm link={link} onClose={closeDelayPopover} />
              </Paper>
            </ClickAwayListener>
          </Popper>
        )}
        {areOptionsOpen && (
          <Popper
            anchorEl={labelWrapperReference.current}
            placement="right"
            open
            style={{ zIndex: 10 }}
          >
            <ClickAwayListener onClickAway={closeOptions}>
              <Paper
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center left',
                }}
              >
                <MenuList classes={menuClasses} onClick={closeOptions}>
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
            </ClickAwayListener>
          </Popper>
        )}
      </foreignObject>
    </>
  );
};

export default TaskLink;
