/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  // useCallback,
  useEffect,
  useLayoutEffect,
  // useMemo,
  useRef,
  // useState,
} from 'react';
// import { EditorState } from 'draft-js';
import { useDispatch } from 'react-redux';
import { useBoolean } from 'hooks/useBoolean';
import { addTask, updateTaskDescription } from 'actions/task-actions';
// import { useBoolean } from 'hooks/useBoolean';
import { checkIfTemplateTask, TaskStatus } from 'helpers/task-helpers';
// import {
// convertFromEditorStateToOutput,
// convertToEditorState,
// isEditorStateEmpty,
// } from 'components/common/TextEditor/helpers';
// import { createMentionEntities } from 'components/common/TextEditor/create-mention-entities';
// import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
// import debounce from 'lodash.debounce';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import { DescriptionTextContainer, DescriptionError } from './styled';

const TaskDescription = ({ selectedTask, readOnly, disableMentions }) => {
  const {
    description,
    status,
    // parentTaskIdentifier,
  } = selectedTask || {};
  // const { taskListIdentifier } = taskList || {};

  const dispatch = useDispatch();
  const firstRender = useRef(true);
  const descriptionReference = useRef(null);
  const [isFocused, setFocused, unsetFocused] = useBoolean(false);
  // const [descriptionState, setDescriptionState] = useMentionsEditorState(
  //   description
  //     ? convertToEditorState({
  //         rawText: description,
  //         tokenizedText: tokenizedDescription,
  //         mentions: taskMentions,
  //       })
  //     : null,
  // );
  // const [descriptionErrorState, setDescriptionErrorState] = useState(false);

  // const isSubtask = !!parentTaskIdentifier;

  // const isTemplateTask = checkIfTemplateTask(selectedTask);

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
        // setDescriptionState();
      }
    }

    if (firstRender) firstRender.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTask]);

  useEffect(() => {
    if (selectedTask && !selectedTask.description) {
      setTimeout(() => {
        descriptionReference.current?.focus();
      }, 0);
    }
  }, [descriptionReference, selectedTask]);

  // const isEmptyDescriptionState = useMemo(
  //   () => isEditorStateEmpty(descriptionState),
  //   [descriptionState],
  // );

  // const handleBlur = useCallback(() => {
  //   const { tokenizedText, rawText, mentions } = convertFromEditorStateToOutput(
  //     descriptionState,
  //     false,
  //   );

  //   if (!tokenizedText) {
  //     setDescriptionErrorState(true);
  //   } else if (selectedTask.taskIdentifier) {
  //     if (tokenizedDescription !== tokenizedText)
  //       dispatch(
  //         updateTaskDescription(selectedTask, {
  //           tokenizedDescription: tokenizedText,
  //           description: rawText,
  //           taskMentions: [
  //             ...(selectedTask.taskMentions || []),
  //             ...(mentions || []),
  //           ],
  //         }),
  //       );
  //   } else {
  //     dispatch(
  //       addTask({
  //         ...selectedTask,
  //         tokenizedDescription: tokenizedText,
  //         description: rawText,
  //         taskMentions: [
  //           ...(selectedTask.taskMentions || []),
  //           ...(mentions || []),
  //         ],
  //       }),
  //     );
  //   }

  //   unsetFocused();
  // }, [
  //   descriptionState,
  //   dispatch,
  //   selectedTask,
  //   tokenizedDescription,
  //   unsetFocused,
  // ]);

  // const handleChange = useCallback(
  //   (state) => {
  //     if (descriptionErrorState) {
  //       const { tokenizedText } = convertFromEditorStateToOutput(state, false);
  //       if (tokenizedText) {
  //         setDescriptionErrorState(false);
  //       }
  //     }
  //     setDescriptionState(state);
  //   },
  //   [descriptionErrorState, setDescriptionState],
  // );

  const handleBlur = (value) => {
    if (selectedTask?.description !== value) {
      dispatch(
        updateTaskDescription(selectedTask, {
          tokenizedDescription: value || '',
        }),
      );
    }
  };

  return (
    <>
      <DescriptionTextContainer isCrossed={status === TaskStatus.COMPLETE}>
        <CustomTextEditor
          key={selectedTask?.identifier}
          // empty={isEmptyDetailsState}
          focused={isFocused}
          label="Description"
          richTextEnabled
        >
          <RichTextEditor
            value={description}
            onBlur={handleBlur}
            showToolbar={false}
            disableToolbar
            showToolbarInline
            multiline={false}
            taskListIdentifier={selectedTask?.taskList?.taskListIdentifier}
            mentions={selectedTask?.taskMentions}
          />
        </CustomTextEditor>
      </DescriptionTextContainer>
      {/* {descriptionErrorState && (
        <DescriptionError>Task description is required</DescriptionError>
      )} */}
    </>
  );
};

export default TaskDescription;
