import React, { useRef } from 'react';
import isNil from 'ramda/src/isNil';
import { useBoolean } from 'hooks/useBoolean';
import { useDispatch } from 'react-redux';
import { Paper, Popper, ClickAwayListener } from '@mui/material';
import { deleteTasksLink, updateTasksLink } from 'actions/task-actions';
import HardDependencyIcon from 'img/template/hard-dependency';
import CalendarIcon from 'img/template/calendar-icon';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { getSmoothStepPath, useStore } from '@xyflow/react';
import { openModal } from 'modal/actions';
import LinkPath from '../LinkPath/LinkPath';
import { LabelsWrapper, HardDependencyLabel } from './styled';
import TaskLinkDelayForm from '../TaskLinkDelayForm/TaskLinkDelayForm';
import TaskLinkOptions from '../TaskLinkOptions/TaskLinkOptions';
import DelayPeriodLabel from '../DelayPeriodLabel/DelayPeriodLabel';
import DeleteIcon from '@mui/icons-material/Delete';

// eslint-disable-next-line sonarjs/cognitive-complexity
const TaskLink = (props) => {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    source: sourceTaskIdentifier,
    target: targetTaskIdentifier,
    sourcePosition,
    targetPosition,
    data: { link },
  } = props;
  const { isDependent, delayPeriod, delayPeriodUnit } = link || {};
  const [, edgeCenterX, edgeCenterY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  const { 2: zoom } = useStore((store) => store.transform);
  const labelWrapperReference = useRef(null);
  const [isDelayPopoverOpen, openDelayPopover, closeDelayPopover] =
    useBoolean(false);
  const [areOptionsOpen, openOptions, closeOptions] = useBoolean(false);
  const dispatch = useDispatch();
  const delayOptionsVisible = !isNil(delayPeriod) && delayPeriodUnit;

  const toggleDependent = () => {
    dispatch(
      updateTasksLink({
        ...link,
        isDependent: !isDependent,
        delayPeriod: null,
        delayPeriodUnit: null,
        delayIsBusinessDays: null,
        timeRelative: null,
        timeReference: null,
        customFieldIdentifier: null,
        customFieldName: null
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
        timeRelative: null,
        timeReference: null,
        customFieldIdentifier: null,
        customFieldName: null
      }),
    );
  };

  const togglePeriodDelay = () => {
    openDelayPopover();
  };

  const deleteLink = () => {
    dispatch(deleteTasksLink(sourceTaskIdentifier, targetTaskIdentifier));
  };

  const handleDelete = (callback, actionName = 'do this action') => {
    const modalProps = {
      title: actionName,
      description: `Are you sure you want to ${actionName.toLowerCase()}? This action cannot be undone.`,
      confirm: callback,
    };

    dispatch(openModal('DeleteConfirmation', modalProps));
  };

  const menuOptions = [
    {
      key: 'dependency',
      icon: <HardDependencyIcon size={20} stroke="black" />,
      label: `${isDependent ? 'Remove' : 'Make'} dependent`,
      onClick: toggleDependent,
    },
    {
      key: 'delay',
      icon: <CalendarIcon size={20} fill="black" />,
      label: `${
        delayPeriod && delayPeriodUnit ? 'Edit' : 'Add'
      } time until task`,
      onClick: () => togglePeriodDelay(),
    },
    {
      key: 'delete',
      icon: <DeleteIcon fontSize="small" color="inherit" />,
      label: `Delete link`,
      onClick: () => handleDelete(deleteLink, 'Delete link'),
    },
  ];

  const handleDelayPeriodSubmit = (delayPeriodData) => {
    dispatch(
      updateTasksLink({
        ...link,
        ...delayPeriodData,
      }),
    );
    closeDelayPopover();
  };

  return (
    <>
      <LinkPath {...props} onClick={isDependent ? undefined : openOptions} />
      <foreignObject
        width={180}
        height={32}
        x={edgeCenterX - 180 / 2}
        y={edgeCenterY - 32 / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
        style={{ overflow: 'visible' }}
        onMouseEnter={isDependent ? undefined : openOptions}
        onMouseLeave={closeOptions}
      >
        <LabelsWrapper ref={labelWrapperReference}>
          {delayOptionsVisible && (
            <DelayPeriodLabel link={link} onClick={openDelayPopover} />
          )}
          {isDependent && (
            <HardDependencyLabel onMouseEnter={openOptions}>
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
                <TaskLinkDelayForm
                  link={link}
                  onSubmit={handleDelayPeriodSubmit}
                  onClose={closeDelayPopover}
                  onRemove={() => {
                    handleDelete(removeDelayPeriod, 'Remove time until task');
                  }}
                  removeButtonVisible={delayOptionsVisible}
                />
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
