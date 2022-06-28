import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { EditorState } from 'draft-js';
import { convertFromEditorStateToOutput } from 'components/common/TextEditor/helpers';
import { createMentionEntities } from 'components/common/TextEditor/create-mention-entities';
import { IconButton } from '@material-ui/core';
import { Replay } from '@material-ui/icons';
import palette from 'styles/palette';
import Button from 'components/common/Button/Button';
import { closeModal } from 'modal/actions';
import CustomTextEditor from 'components/task-drawer/CustomTextEditor/CustomTextEditor';
import TextEditor from 'components/common/TextEditor/TextEditor';
import Select from 'components/common/Select/Select';
import { EmrNoteTypeOptions } from 'helpers/task-helpers';
import { sendEmrForTask } from 'actions/task-actions';
import {
  IncludeContainerStyled,
  InfoHeaderTextStyled,
  InputContainerStyled,
  TextEditorContainerStyled,
} from '../styled';
import {
  CloseIcon,
  CloseIconButton,
  ModalDescription,
  ModalDescriptionContainer,
  ModalFooterStyled,
  ModalHeader,
  ModalHeaderContainerStyled,
  ModalWrapper,
} from '../../styled';
import TaskCheckBoxes from '../TaskCheckBoxes';

function SendEmrNoteFromTaskModal() {
  const selectedTask = useSelector(selectedTaskSelector);
  const { taskMentions, taskIdentifier } = selectedTask;
  const dispatch = useDispatch();
  const [noteType, setNoteType] = useState(null);
  const [isTaskDescriptionIncluded, setIsTaskDescriptionIncluded] = useState(
    false,
  );
  const [isTaskDetailsIncluded, setIsTaskDetailsIncluded] = useState(false);

  const [isTaskCommentsIncluded, setIsTaskCommentsIncluded] = useState(false);

  const [detailsState, setDetailsState] = useState(() =>
    EditorState.createEmpty(),
  );

  const insertTextFromTask = useCallback(
    meta => {
      const currentState = convertFromEditorStateToOutput(detailsState, true);
      const newState = createMentionEntities(
        `${currentState.meta}\n ${meta.meta}`,
        `${currentState.tokenizedText}\n${meta.tokenized}`,
        [...currentState.mentions, taskMentions],
        true,
      );

      setDetailsState(EditorState.push(detailsState, newState));
    },
    [detailsState, taskMentions],
  );

  const handleReset = useCallback(() => {
    setIsTaskCommentsIncluded(false);
    setIsTaskDescriptionIncluded(false);
    setIsTaskDetailsIncluded(false);
    setDetailsState(EditorState.createEmpty());
  }, []);

  const handleOptionChange = event => {
    const { value } = event.target;
    setNoteType(value);
  };

  const EmrOptions = Object.keys(EmrNoteTypeOptions).map(option => ({
    label: EmrNoteTypeOptions[option],
    value: option,
  }));

  return (
    <ModalWrapper width="600px">
      <CloseIconButton size="small" onClick={() => dispatch(closeModal())}>
        <CloseIcon htmlColor="#C1CCDA" />
      </CloseIconButton>
      <ModalHeaderContainerStyled>
        <ModalHeader>post note to emr</ModalHeader>
        <ModalDescription>
          Post a summary to the patient’s medical record
        </ModalDescription>
      </ModalHeaderContainerStyled>
      <ModalDescriptionContainer>
        <InputContainerStyled>
          <Select
            options={EmrOptions}
            value={noteType}
            onChange={handleOptionChange}
          />
        </InputContainerStyled>
        <IncludeContainerStyled>
          <InfoHeaderTextStyled>Include the following</InfoHeaderTextStyled>
          <IconButton onClick={handleReset}>
            <Replay htmlColor={palette.coolGrey9} />
          </IconButton>
        </IncludeContainerStyled>
        <TaskCheckBoxes
          isTaskDescriptionIncluded={isTaskDescriptionIncluded}
          setIsTaskDescriptionIncluded={setIsTaskDescriptionIncluded}
          isTaskDetailsIncluded={isTaskDetailsIncluded}
          setIsTaskDetailsIncluded={setIsTaskDetailsIncluded}
          isTaskCommentsIncluded={isTaskCommentsIncluded}
          setIsTaskCommentsIncluded={setIsTaskCommentsIncluded}
          insertTextFromTask={insertTextFromTask}
          selectedTask={selectedTask}
        />
        <TextEditorContainerStyled>
          <CustomTextEditor label="Emr note">
            <TextEditor
              readOnly={false}
              minHeight={100}
              disableMentions
              showToolbar
              state={detailsState}
              onChange={setDetailsState}
            />
          </CustomTextEditor>
        </TextEditorContainerStyled>
      </ModalDescriptionContainer>
      <ModalFooterStyled>
        <Button
          uppercase
          width="150px"
          variant="primary"
          disabled={!detailsState.getCurrentContent().hasText()}
          onClick={() => {
            dispatch(
              sendEmrForTask({
                noteType,
                details: convertFromEditorStateToOutput(detailsState, true)
                  .tokenizedText,
                taskIdentifier,
              }),
            );
            dispatch(closeModal());
          }}
        >
          post
        </Button>
      </ModalFooterStyled>
    </ModalWrapper>
  );
}

export default SendEmrNoteFromTaskModal;
