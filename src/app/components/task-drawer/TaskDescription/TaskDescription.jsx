/* eslint-disable sonarjs/cognitive-complexity */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useBoolean } from 'hooks/useBoolean';
import { updateTaskDescription } from 'actions/task-actions';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import { DescriptionTextContainer, DescriptionError } from './styled';
import palette from '@/app/styles/palette';

const TaskDescription = ({
  selectedTask,
  readOnly,
  addTaskDrawer,
  taskDescription,
  setTaskDescription,
  isClicked = false,
}) => {
  const { tokenizedDescription } = selectedTask || {};

  const dispatch = useDispatch();
  const firstRender = useRef(true);
  const descriptionReference = useRef(null);
  const [isFocused] = useBoolean(false);
  const [descriptionState, setDescriptionState] =
    useState(tokenizedDescription);

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
    addTaskDrawer ? setTaskDescription(value) : setDescriptionState(value);
  };

  const handleBlur = (value) => {
    if (selectedTask?.description !== value && !addTaskDrawer) {
      dispatch(
        updateTaskDescription(selectedTask, {
          tokenizedDescription: value || '',
        }),
      );
    }
  };

  const addDrawerStyle = {
    border: isClicked && !taskDescription && `1px solid ${palette.oPlusRed}`,
    borderRadius: '2px',
  };

  return (
    <>
      <DescriptionTextContainer>
        Task
        <div style={addTaskDrawer && addDrawerStyle}>
          <CustomTextEditor
            key={selectedTask?.identifier}
            focused={isFocused}
            richTextEnabled
            addExtraPaddingOnTop
          >
            <RichTextEditor
              value={addTaskDrawer ? taskDescription : descriptionState}
              onChange={handleChange}
              onBlur={handleBlur}
              showToolbar={false}
              disableToolbar
              showToolbarInline
              multiline={false}
              initOnClick
              taskListIdentifier={selectedTask?.taskList?.taskListIdentifier}
              mentions={selectedTask?.taskMentions}
              readonly={readOnly}
              showCharCount
              characterLimit={1000}
            />
          </CustomTextEditor>
        </div>
      </DescriptionTextContainer>
      {addTaskDrawer && isClicked && !taskDescription && (
        <DescriptionError>Task description is required</DescriptionError>
      )}
    </>
  );
};

export default TaskDescription;
