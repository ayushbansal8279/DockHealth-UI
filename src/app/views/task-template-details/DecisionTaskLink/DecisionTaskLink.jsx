import React, { useState, useEffect, useRef } from 'react';
import { deleteTasksLink } from 'actions/task-actions';
import {
  addTaskOutcome,
  updateTaskOutcome,
} from 'actions/task-template-actions';
import useBoolean from 'hooks/useBoolean';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { getEdgeCenter } from 'react-flow-renderer';
import { useDispatch } from 'react-redux';
import { EdgeLabel, OutcomeInput, ButtonsContainer } from './styled';
import LinkPath from '../LinkPath/LinkPath';

const DecisionTaskLink = props => {
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
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  const inputReference = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [isEdited, setEdited, unsetEdited] = useBoolean(!outcome);
  const [isFocused, setFocused, unsetFocused] = useBoolean(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (outcomeName) {
      setInputValue(outcomeName);
      unsetEdited();
    }
  }, [outcomeName, unsetEdited]);

  useEffect(() => {
    if (isEdited && outcome) inputReference.current.focus();
  }, [isEdited, outcome]);

  useEffect(() => {
    if (!isFocused && outcome) {
      setInputValue(outcome.name);
      unsetEdited();
    }
  }, [isFocused, outcome, unsetEdited]);

  const clearInput = () => {
    setInputValue();
  };

  const handleKeyPress = event => {
    const { key } = event;

    switch (key) {
      case 'Enter':
        if (inputValue.length > 1) {
          if (outcome) {
            dispatch(
              updateTaskOutcome(
                taskOutcomeIdentifier,
                sourceTaskIdentifier,
                inputValue,
              ),
            );
          } else {
            dispatch(addTaskOutcome(inputValue, sourceTaskIdentifier, link));
          }
        }
        break;
      case 'Escape':
        clearInput();
        break;
      default:
        break;
    }
  };

  return (
    <>
      <LinkPath {...props} />
      <foreignObject
        width={160}
        height={27}
        x={edgeCenterX - 160 / 2}
        y={edgeCenterY - 27 / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <EdgeLabel hasOutcome={!!outcome}>
          <OutcomeInput
            ref={inputReference}
            readOnly={!isEdited}
            placeholder="Type option"
            value={inputValue}
            onChange={event => setInputValue(event.target?.value || '')}
            onKeyPress={handleKeyPress}
            onFocus={setFocused}
            onBlur={unsetFocused}
          />
          {!!outcome && (
            <ButtonsContainer>
              <IconButton onClick={setEdited}>
                <EditIcon fontSize="small" color="inherit" />
              </IconButton>
              <IconButton
                onClick={() =>
                  dispatch(
                    deleteTasksLink(sourceTaskIdentifier, targetTaskIdentifier),
                  )
                }
              >
                <DeleteIcon fontSize="small" color="inherit" />
              </IconButton>
            </ButtonsContainer>
          )}
        </EdgeLabel>
      </foreignObject>
    </>
  );
};

export default DecisionTaskLink;
