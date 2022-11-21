/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { Fade, Popper } from '@material-ui/core';
import { openDrawer } from 'actions/workflow-drawer-actions';
import { checkIfShouldDisplayTooltip } from 'components/task/OverflowTooltip/OverflowTooltip';
import { useDispatch } from 'react-redux';
import {
  TaskTemplateNameInput,
  NameContainer,
  NameTooltip,
  TaskTemplateDescriptionIndicators,
  TaskTemplateContext,
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
}) => {
  const dispatch = useDispatch();
  const [isHoverVisible, setIsHoverVisible] = useState(false);
  const { name, identifier } = templateGroup;

  return (
    <>
      <NameContainer
        onMouseEnter={() => setIsHoverVisible(true)}
        onMouseLeave={() => setIsHoverVisible(false)}
        onClick={() => {
          dispatch(openDrawer(identifier, templateGroup));
        }}
      >
        <>
          <TaskTemplateNameInput
            ref={nameInputReference}
            readOnly={!isEditing}
            error={nameInputError}
            onChange={event => {
              setNameInputValue(event.target?.value);
              setNameInputError(false);
            }}
            onBlur={() => {
              setIsEditing(false);
              setNameInputValue(name);
            }}
            onKeyDown={handleNameInputKeyDown}
            value={nameInputValue}
            onClick={event => {
              if (isEditing) {
                event.stopPropagation();
              }
            }}
          />
          {templateGroup?.sourceTaskBundleTemplate && (
            <TaskTemplateDescriptionIndicators>
              <TaskTemplateContext>
                <span>{templateGroup?.sourceTaskBundleTemplate?.name}</span>
              </TaskTemplateContext>
            </TaskTemplateDescriptionIndicators>
          )}
        </>
      </NameContainer>
      <Popper
        anchorEl={nameInputReference?.current}
        placement="bottom-start"
        open={
          checkIfShouldDisplayTooltip(nameInputReference?.current) &&
          isHoverVisible
        }
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
