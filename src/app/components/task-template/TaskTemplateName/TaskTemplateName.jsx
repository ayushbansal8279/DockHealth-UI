/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from 'react';
import { Fade, Popper } from '@mui/material';
import { openDrawer } from 'actions/workflow-drawer-actions';
import { checkIfShouldDisplayTooltip } from 'components/task/OverflowTooltip/OverflowTooltip';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';
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

  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  }, [nameInputValue]);

  const TooltipWrapper = isTruncated ? Tooltip : React.Fragment;

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
            <TooltipWrapper {...(isTruncated && { placement: 'top', title: nameInputValue })}>
              <div
                ref={textRef}
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                <Highlighter
                  highlightClassName="list-highlight"
                  searchWords={highlightedValue?.toLowerCase().split(/\s+/)}
                  autoEscape
                  textToHighlight={nameInputValue}
                />
              </div>
            </TooltipWrapper>
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
