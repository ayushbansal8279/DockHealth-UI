/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useEffect, useRef } from 'react';
import { ClickAwayListener, Paper, Popper } from '@mui/material';
import isNil from 'ramda/src/isNil';
import CalendarIcon from 'img/template/calendar-icon';
import { deleteTasksLink, updateTasksLink } from 'actions/task-actions';
import {
  addTaskOutcome,
  updateTaskOutcome,
} from 'actions/task-template-actions';
import { useBoolean } from 'hooks/useBoolean';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useStore, getSmoothStepPath } from 'reactflow';
import { useDispatch } from 'react-redux';
import { openModal } from 'modal/actions';
import LinkPath from '../LinkPath/LinkPath';
import TaskLinkOptions from '../TaskLinkOptions/TaskLinkOptions';
import TaskLinkDelayForm from '../TaskLinkDelayForm/TaskLinkDelayForm';
import DelayPeriodLabel from '../DelayPeriodLabel/DelayPeriodLabel';
import { LabelsWrapper } from './styled';
import OutcomeInputLabel from '../OutcomeInputLabel/OutcomeInputLabel';

const DecisionTaskLink = (props) => {
  const {
    sourceX,
    sourceY,
    source: sourceTaskIdentifier,
    target: targetTaskIdentifier,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
  } = props;
  const { outcome, link } = data;
  const { taskOutcomeIdentifier, name: outcomeName } = outcome || {};
  const { delayPeriod, delayPeriodUnit } = link || {};
  const [, edgeCenterX, edgeCenterY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  const inputReference = useRef(null);
  const edgeLabelReference = useRef(null);
  const [areOptionsOpen, openOptions, closeOptions] = useBoolean(false);
  const [isDelayPopoverOpen, openDelayPopover, closeDelayPopover] =
    useBoolean(false);
  const [inputValue, setInputValue] = useState('');
  const [isEdited, setEdited, unsetEdited] = useBoolean(!outcome);
  const [isFocused, setFocused, unsetFocused] = useBoolean(false);
  const dispatch = useDispatch();
  const { 2: zoom } = useStore((store) => store.transform);

  const delayOptionsVisible = !isNil(delayPeriod) && delayPeriodUnit;

  useEffect(() => {
    if (outcomeName) {
      setInputValue(outcomeName);
      unsetEdited();
    }
  }, [outcomeName, unsetEdited]);

  useEffect(() => {
    if (isEdited && outcome) inputReference.current?.focus();
  }, [isEdited, outcome]);

  useEffect(() => {
    if (!isFocused && outcome) {
      unsetEdited();
    }
  }, [isFocused, outcome, unsetEdited]);

  const deleteLink = () => {
    dispatch(deleteTasksLink(sourceTaskIdentifier, targetTaskIdentifier));
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
      key: 'edit',
      icon: <EditIcon style={{ height: 13 }} />,
      label: `Edit outcome`,
      onClick: setEdited,
    },
    {
      key: 'delay',
      icon: <CalendarIcon size={11} />,
      label: `${
        delayPeriod && delayPeriodUnit ? 'Remove' : 'Add'
      } time until task`,
      onClick: togglePeriodDelay,
    },
    {
      key: 'delete',
      icon: <DeleteOutlineIcon style={{ height: 13 }} />,
      label: `Delete link`,
      onClick: () => handleDelete(deleteLink, 'Delete link'),
    },
  ];

  const clearInput = () => {
    setInputValue();
  };

  const saveTaskOutcome = () => {
    if (inputValue.length > 0) {
      if (outcome) {
        if (outcome.name !== inputValue) {
          dispatch(
            updateTaskOutcome(
              taskOutcomeIdentifier,
              sourceTaskIdentifier,
              inputValue,
            ),
          );
        }
      } else {
        dispatch(addTaskOutcome(inputValue, sourceTaskIdentifier, link));
      }
    }
  };

  const handleKeyPress = (event) => {
    const { key } = event;

    switch (key) {
      case 'Enter': {
        saveTaskOutcome();
        break;
      }
      case 'Escape': {
        clearInput();
        break;
      }
      default: {
        break;
      }
    }
  };

  const handleDelayPeriodSubmit = (delayPeriodData) => {
    dispatch(
      updateTasksLink({
        ...link,
        ...delayPeriodData,
      }),
    );
    closeDelayPopover();
  };

  const handleInputBlur = () => {
    saveTaskOutcome();
    unsetFocused();
    unsetEdited();
  };

  return (
    <>
      <LinkPath {...props} />
      <foreignObject
        width={300}
        height={32}
        x={edgeCenterX - 300 / 2}
        y={edgeCenterY - 32 / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
        style={{ overflow: 'visible' }}
      >
        <LabelsWrapper>
          <div
            onMouseEnter={outcome ? openOptions : undefined}
            onMouseLeave={closeOptions}
          >
            <OutcomeInputLabel
              ref={edgeLabelReference}
              inputRef={inputReference}
              readOnly={!isEdited}
              value={inputValue}
              onChange={(event) => setInputValue(event.target?.value || '')}
              onKeyPress={handleKeyPress}
              onFocus={setFocused}
              onBlur={handleInputBlur}
              hasOutcome={!!outcome}
            />
            {areOptionsOpen && (
              <TaskLinkOptions
                anchorEl={edgeLabelReference.current}
                options={menuOptions}
                onClose={closeOptions}
              />
            )}
          </div>
          <div style={{ paddingTop: '5px' }}>
            {delayOptionsVisible && (
              <DelayPeriodLabel link={link} onClick={openDelayPopover} />
            )}
          </div>
        </LabelsWrapper>
        {isDelayPopoverOpen && (
          <Popper
            anchorEl={edgeLabelReference.current}
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
                />
              </Paper>
            </ClickAwayListener>
          </Popper>
        )}
      </foreignObject>
    </>
  );
};

export default DecisionTaskLink;
