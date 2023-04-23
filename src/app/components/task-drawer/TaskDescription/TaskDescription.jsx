/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
// import { EditorState } from 'draft-js';
import { useDispatch } from 'react-redux';
import { addTask, updateTaskDescription } from 'actions/task-actions';
import { useBoolean } from 'hooks/useBoolean';
import { checkIfTemplateTask, TaskStatus } from 'helpers/task-helpers';
import TextEditor from 'components/common/TextEditor/TextEditor';
import {
  convertFromEditorStateToOutput,
  convertToEditorState,
  isEditorStateEmpty,
} from 'components/common/TextEditor/helpers';
// import { createMentionEntities } from 'components/common/TextEditor/create-mention-entities';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import { DescriptionTextContainer, DescriptionError } from './styled';
import RichTextEditor from "components/RichTextEditorV2/RichTextEditor";
import Input from "../../../../ui-toolkit/Form/Input/Input";
import debounce from "lodash.debounce";

const TaskDescription = ({ selectedTask, readOnly, disableMentions }) => {
  const {
    description,
    tokenizedDescription,
    taskMentions,
    status,
    parentTaskIdentifier,
    taskList,
  } = selectedTask || {};
  const { taskListIdentifier } = taskList || {};

  const dispatch = useDispatch();
  const firstRender = useRef(true);
  const descriptionReference = useRef(null);
  const [isFocused, setFocused, unsetFocused] = useBoolean(false);
  const [descriptionState, setDescriptionState] = useMentionsEditorState(
    description
      ? convertToEditorState({
          rawText: description,
          tokenizedText: tokenizedDescription,
          mentions: taskMentions,
        })
      : null,
  );
  const [descriptionErrorState, setDescriptionErrorState] = useState(false);

  const isSubtask = !!parentTaskIdentifier;

  const isTemplateTask = checkIfTemplateTask(selectedTask);

  useLayoutEffect(() => {
    if (!firstRender.current && selectedTask) {
      if (selectedTask.description) {
        // const newContent = createMentionEntities(
        //   selectedTask.tokenizedDescription,
        //   selectedTask.description,
        //   selectedTask.taskMentions,
        //   false,
        // );
        // setDescriptionState(EditorState.push(descriptionState, newContent));
      } else {
        setDescriptionState();
      }
    }

    if (firstRender) firstRender.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTask]);

  useEffect(() => {
    if (selectedTask && !selectedTask.description) {
      setTimeout(() => {
        descriptionReference.current.focus();
      }, 0);
    }
  }, [descriptionReference, selectedTask]);

  const isEmptyDescriptionState = useMemo(
    () => isEditorStateEmpty(descriptionState),
    [descriptionState],
  );

  const handleBlur = useCallback(() => {
    const { tokenizedText, rawText, mentions } = convertFromEditorStateToOutput(
      descriptionState,
      false,
    );

    if (!tokenizedText) {
      setDescriptionErrorState(true);
    } else if (selectedTask.taskIdentifier) {
      if (tokenizedDescription !== tokenizedText)
        dispatch(
          updateTaskDescription(selectedTask, {
            tokenizedDescription: tokenizedText,
            description: rawText,
            taskMentions: [
              ...(selectedTask.taskMentions || []),
              ...(mentions || []),
            ],
          }),
        );
    } else {
      dispatch(
        addTask({
          ...selectedTask,
          tokenizedDescription: tokenizedText,
          description: rawText,
          taskMentions: [
            ...(selectedTask.taskMentions || []),
            ...(mentions || []),
          ],
        }),
      );
    }

    unsetFocused();
  }, [
    descriptionState,
    dispatch,
    selectedTask,
    tokenizedDescription,
    unsetFocused,
  ]);

  const handleChange = useCallback(
    (state) => {
      if (descriptionErrorState) {
        const { tokenizedText } = convertFromEditorStateToOutput(state, false);
        if (tokenizedText) {
          setDescriptionErrorState(false);
        }
      }
      setDescriptionState(state);
    },
    [descriptionErrorState, setDescriptionState],
  );

  // const handleInputChange = debounce((_, { value }) => {
  //   dispatch(
  //       updateTaskDescription(selectedTask, {
  //         tokenizedDescription: value
  //       })
  //   )
  // }, 1000)

  const handleInputBlur = (_, { value }) => {
    if (value && value !== '' && value !== selectedTask?.tokenizedDescription) {
      dispatch(
        updateTaskDescription(selectedTask, {
          tokenizedDescription: value,
        }),
      );
    }
  };

  return (
    <>
      <DescriptionTextContainer isCrossed={status === TaskStatus.COMPLETE}>
        <Input
          value={description}
          placeholder="Task description"
          onBlur={handleInputBlur}
          mentions={taskMentions}
          enabled={{
            mentions: false,
          }}
        />
      </DescriptionTextContainer>
      {descriptionErrorState && (
        <DescriptionError>Task description is required</DescriptionError>
      )}
    </>
  );
};

export default TaskDescription;
