/* eslint-disable sonarjs/cognitive-complexity */
import React, { useRef, useEffect } from 'react';
import { isNil } from 'ramda';
import useBoolean from 'hooks/useBoolean';
import { useDispatch } from 'react-redux';
import { Paper, Popper, ClickAwayListener } from '@material-ui/core';
import { deleteTasksLink, updateTasksLink } from 'actions/task-actions';
import HardDependencyIcon from 'img/template/hard-dependency';
import CalendarIcon from 'img/template/calendar-icon';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { getEdgeCenter, useStoreState } from 'react-flow-renderer';
import LinkPath from '../LinkPath/LinkPath';
import { LabelsWrapper, HardDependencyLabel, DelayPeriodLabel } from './styled';
import TaskLinkDelayForm from './TaskLinkDelayForm';
import TaskLinkOptions from '../TaskLinkOptions/TaskLinkOptions';

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

  const togglePeriodDelay = () => {
    if (delayOptionsVisible) {
      removeDelayPeriod();
    } else {
      openDelayPopover();
    }
  };

  const deleteLink = () => {
    dispatch(deleteTasksLink(sourceTaskIdentifier, targetTaskIdentifier));
  };

  const menuOptions = [
    {
      key: 'dependency',
      icon: <HardDependencyIcon size={11} />,
      label: `${isDependent ? 'Remove' : 'Make'} dependent`,
      onClick: toggleDependent,
    },
    {
      key: 'delay',
      icon: <CalendarIcon size={11} />,
      label: `${
        delayPeriod && delayPeriodUnit ? 'Remove' : 'Add'
      } time till task`,
      onClick: togglePeriodDelay,
    },
    {
      key: 'delete',
      icon: <DeleteOutlineIcon style={{ height: 13 }} />,
      label: `Delete link`,
      onClick: deleteLink,
    },
  ];

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
          <TaskLinkOptions
            anchorEl={labelWrapperReference.current}
            options={menuOptions}
            onClose={closeOptions}
          />
        )}
      </foreignObject>
    </>
  );
};

export default TaskLink;
