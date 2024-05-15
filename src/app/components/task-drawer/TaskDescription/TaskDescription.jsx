/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  // useCallback,
  useEffect,
  useLayoutEffect,
  // useMemo,
  useRef,
  useState,
} from 'react';
// import { EditorState } from 'draft-js';
import { useDispatch } from 'react-redux';
import { useBoolean } from 'hooks/useBoolean';
import { addTask, updateTaskDescription } from 'actions/task-actions';
// import { useBoolean } from 'hooks/useBoolean';
import { checkIfTemplateTask, TaskStatus } from 'helpers/task-helpers';
// import debounce from 'lodash.debounce';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import { DescriptionTextContainer, DescriptionError } from './styled';

const TaskDescription = ({ selectedTask, readOnly }) => {
  const {
    // description,
    tokenizedDescription,
    status,
    // parentTaskIdentifier,
  } = selectedTask || {};
  // const { taskListIdentifier } = taskList || {};

  const dispatch = useDispatch();
  const firstRender = useRef(true);
  const descriptionReference = useRef(null);
  const [isFocused, setFocused, unsetFocused] = useBoolean(false);
  const [descriptionState, setDescriptionState] =
    useState(tokenizedDescription);
  // const [descriptionErrorState, setDescriptionErrorState] = useState(false);

  // const isSubtask = !!parentTaskIdentifier;

  // const isTemplateTask = checkIfTemplateTask(selectedTask);

  useLayoutEffect(() => {
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

  const handleChange = (value) => {
    setDescriptionState(value);
  };

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
      <DescriptionTextContainer>
        Task
        <CustomTextEditor
          key={selectedTask?.identifier}
          // empty={isEmptyDetailsState}
          focused={isFocused}
          richTextEnabled
        >
          <RichTextEditor
            value={descriptionState}
            onChange={handleChange}
            onBlur={handleBlur}
            showToolbar={false}
            disableToolbar
            showToolbarInline
            multiline={false}
            taskListIdentifier={selectedTask?.taskList?.taskListIdentifier}
            mentions={selectedTask?.taskMentions}
            readonly={readOnly}
            showCharCount
            characterLimit={1000}
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
