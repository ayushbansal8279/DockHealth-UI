/* eslint-disable react-hooks/rules-of-hooks */
import React, { useRef } from 'react';
import { Fade, Popper } from '@material-ui/core';
import { openDrawer } from 'actions/workflow-drawer-actions';
import { checkIfShouldDisplayTooltip } from 'components/task/OverflowTooltip/OverflowTooltip';
import { useDispatch } from 'react-redux';
import TextEditor from 'components/common/TextEditor/TextEditor';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import { convertToEditorState } from 'components/common/TextEditor/helpers';
import {
  NameContainer,
  NameTooltip,
  TaskTemplateDescriptionIndicators,
  TaskTemplateContext,
} from './styled';

const TaskTemplateName = ({
  nameInputReference,
  templateGroup,
  nameInputValue,
  highlightedValue,
}) => {
  const dispatch = useDispatch();
  const {
    name,
    identifier,
    tokenizedDescription,
    taskMentions,
    taskListIdentifier,
    searchMetaData,
  } = templateGroup;

  const descriptionReference = useRef(null);
  const { matchDescription } = searchMetaData || {};
  const [descriptionState, setDescriptionState] = useMentionsEditorState(
    convertToEditorState({
      rawText: nameInputValue,
      tokenizedText: tokenizedDescription,
      mentions: taskMentions,
      handleRichText: false,
    }),
  );

  return (
    <>
      <NameContainer
        onClick={() => {
          dispatch(openDrawer(identifier, templateGroup));
        }}
      >
        <>
          {/* <TaskTemplateNameInput
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
          /> */}
          <TextEditor
            ref={descriptionReference}
            readOnly
            oneline
            state={descriptionState}
            onChange={setDescriptionState}
            taskListIdentifier={taskListIdentifier}
            highlightedValues={
              matchDescription && highlightedValue?.toLowerCase().split(/\s+/)
            }
            // keyBindingFn={handleKeyBindingFn}
            // handleKeyCommand={handleKeyCommand}
            // onBlur={handleBlur}
            // disableMentions={disableMentions}
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
