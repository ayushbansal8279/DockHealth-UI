/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { Fade, Popper } from '@mui/material';
import { openDrawer } from 'actions/workflow-drawer-actions';
import { checkIfShouldDisplayTooltip } from 'components/task/OverflowTooltip/OverflowTooltip';
import { useDispatch } from 'react-redux';
import Highlighter from 'react-highlight-words';
import {
  NameContainer,
  NameTooltip,
  // TaskTemplateDescriptionIndicators,
  // TaskTemplateContext,
  TaskTemplateNameInput,
} from './styled';

const TaskTemplateName = ({
  nameInputReference,
  templateGroup,
  isEditing,
  nameInputError,
  setNameInputValue,
  setNameInputError,
  setIsEditing,
  handleNameInputKeyDown,
  nameInputValue,
  highlightedValue = '',
}) => {
  const dispatch = useDispatch();
  const { name, identifier } = templateGroup;

  return (
    <>
      <NameContainer
        onClick={() => {
          dispatch(openDrawer(identifier, templateGroup));
        }}
      >
        <>
          {isEditing && (
            <TaskTemplateNameInput
              ref={nameInputReference}
              readOnly={!isEditing}
              error={nameInputError}
              onChange={(event) => {
                setNameInputValue(event.target?.value);
                setNameInputError(false);
              }}
              onBlur={() => {
                setIsEditing(false);
                setNameInputValue(name);
              }}
              onKeyDown={handleNameInputKeyDown}
              value={nameInputValue}
              onClick={(event) => {
                if (isEditing) {
                  event.stopPropagation();
                }
              }}
            />
          )}
          {!isEditing && (
            <Highlighter
              highlightClassName="list-highlight"
              searchWords={highlightedValue?.toLowerCase().split(/\s+/)}
              autoEscape
              textToHighlight={nameInputValue}
            />
          )}
          {/* This line will be required when we implement this on Tooltip in Future */}
          {/* {templateGroup?.linkedSourceTaskBundle && (
            <TaskTemplateDescriptionIndicators>
              <TaskTemplateContext>
                <span>{templateGroup?.linkedSourceTaskBundle?.name}</span>
              </TaskTemplateContext>
            </TaskTemplateDescriptionIndicators>
          )} */}
        </>
      </NameContainer>
      <Popper
        anchorEl={nameInputReference?.current}
        placement="bottom-start"
        open={checkIfShouldDisplayTooltip(nameInputReference?.current)}
        style={{
          zIndex: 115,
          maxWidth: nameInputReference?.current?.offsetWidth || '650px',
        }}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={250}>
            <NameTooltip>{name}</NameTooltip>
          </Fade>
        )}
      </Popper>
    </>
  );
};
export default TaskTemplateName;
