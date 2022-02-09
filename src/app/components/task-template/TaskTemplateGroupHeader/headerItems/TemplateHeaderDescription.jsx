/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable import/extensions */
import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { Box, Fade, Popper } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { updateTaskDescription } from 'actions/task-actions';
import { TaskStatus } from 'helpers/task-helpers';
import TextEditor from 'components/common/TextEditor/TextEditor';
import { checkIfShouldDisplayTooltip } from 'components/task/OverflowTooltip/OverflowTooltip';
import {
  convertToEditorState,
  convertFromEditorStateToOutput,
} from 'components/common/TextEditor/helpers';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import { EditorState } from 'draft-js';
import { createMentionEntities } from 'components/common/TextEditor/create-mention-entities';
import Input from 'components/common/Input/Input';
import {
  Description,
  DescriptionBox,
  DescriptionTooltipWrapper,
  DescriptionBorder,
  TaskTemplateNameInput,
} from './styled';

const TemplateHeaderDescription = ({
  templateGroup,
  highlightedValue,
  isEditing,
  setEditing,
}) => {
  const {
    name,
    description,
    tokenizedDescription,
    taskMentions,
    status,
    searchMetaData,
    taskList,
  } = templateGroup;

  console.log('templateGroup', templateGroup);
  const { taskListIdentifier } = taskList || {};
  const { matchDescription } = searchMetaData || {};
  const previousDescription = useRef(null);
  const descriptionTextReference = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const [value, setValue] = useState(name || '');
  const descriptionReference = useRef(null);
  // const convertedDescriptionState = useMemo(
  //   () => convertFromEditorStateToOutput(descriptionState, false),
  //   [descriptionState],
  // );

  useEffect(() => {
    if (isEditing && descriptionReference.current) {
      setTimeout(descriptionReference.current.focus, 0);
    }
  }, [isEditing, descriptionReference]);

  // useEffect(() => {
  //   if (previousDescription.current !== null) {
  //     const newContent = createMentionEntities(
  //       tokenizedDescription,
  //       description,
  //       taskMentions,
  //       false,
  //     );
  //     setDescriptionState(EditorState.push(descriptionState, newContent));
  //   }
  //   previousDescription.current = description;
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [description]);

  // const handleKeyBindingFn = useCallback(event => {
  //   if (event.key === 'Enter') {
  //     return 'enter-command';
  //   }

  //   return undefined;
  // }, []);

  const handleBlur = useCallback(() => {
    // const { tokenizedText, rawText, mentions } = convertFromEditorStateToOutput(
    //   descriptionState,
    //   false,
    // );
    // if (rawText !== description) {
    //   dispatch(
    //     updateTaskDescription(templateGroup, {
    //       tokenizedDescription: tokenizedText,
    //       description: rawText,
    //       taskMentions: [
    //         ...(templateGroup.taskMentions || []),
    //         ...(mentions || []),
    //       ],
    //     }),
    //   );
    // }
    setEditing(false);
  }, [setEditing]);

  const handleKeyCommand = useCallback(
    command => {
      if (command === 'enter-command') {
        // eslint-disable-next-line no-unused-expressions
        descriptionReference.current?.blur();
        return 'handled';
      }

      return 'not-handled';
    },
    [descriptionReference],
  );

  return (
    <DescriptionBox>
      <Box display="flex" flex={1} overflow="hidden">
        <Description
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          ref={reference => {
            if (reference) {
              descriptionTextReference.current = reference.querySelector(
                '.public-DraftStyleDefault-block',
              );
            }
          }}
        >
          <DescriptionBorder
            isEdited={isEditing}
            onClick={event => {
              event.stopPropagation();
              event.preventDefault();
              setEditing(true);
            }}
          >
            {/* <TextEditor
              ref={descriptionReference}
              readOnly={!isEditing}
              oneline
              state={descriptionState}
              onChange={setDescriptionState}
              taskListIdentifier={taskListIdentifier}
              highlightedValues={
                matchDescription && highlightedValue?.toLowerCase().split(/\s+/)
              }
              keyBindingFn={handleKeyBindingFn}
              handleKeyCommand={handleKeyCommand}
              onBlur={handleBlur}
            /> */}
            <TaskTemplateNameInput
              handleKeyCommand={handleKeyCommand}
              inputRef={descriptionReference}
              onBlur={handleBlur}
              readOnly={!isEditing}
              value={value}
              onChange={event => setValue(event.target.value)}
            />
            <Popper
              anchorEl={descriptionTextReference.current}
              placement="bottom-start"
              open={
                checkIfShouldDisplayTooltip(descriptionTextReference.current) &&
                isHovered &&
                !isEditing
              }
              style={{
                zIndex: 115,
                maxWidth:
                  descriptionTextReference?.current?.offsetWidth || '650px',
              }}
              transition
            >
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={250}>
                  <DescriptionTooltipWrapper>{value}</DescriptionTooltipWrapper>
                </Fade>
              )}
            </Popper>
          </DescriptionBorder>
        </Description>
      </Box>
    </DescriptionBox>
  );
};
export default TemplateHeaderDescription;
