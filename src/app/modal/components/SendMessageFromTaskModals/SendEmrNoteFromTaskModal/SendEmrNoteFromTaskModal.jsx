import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
// import { EditorState } from 'draft-js';
import {
  convertFromEditorStateToOutput,
  // addStylesToText,
} from 'components/common/TextEditor/helpers';
// import { createMentionEntities } from 'components/common/TextEditor/create-mention-entities';
import { IconButton } from '@mui/material';
import { Replay } from '@mui/icons-material';
import palette from 'styles/palette';
import Button from 'components/common/Button/Button';
import { closeModal } from 'modal/actions';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import TextEditor from 'ui-toolkit/Form/TextEditor/TextEditor';
import Select from 'components/common/Select/Select';
import { EmrNoteTypeOptions, CommunicationType } from 'helpers/task-helpers';
import TemplateAutoComplete from 'components/common/TemplateAutoComplete/TemplateAutoComplete';
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
  const [isTaskDescriptionIncluded, setIsTaskDescriptionIncluded] =
    useState(false);
  const [isTaskDetailsIncluded, setIsTaskDetailsIncluded] = useState(false);

  const [isTaskCommentsIncluded, setIsTaskCommentsIncluded] = useState(false);

  const [detailsState, setDetailsState] = useState('');

  const insertTextFromTask = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (meta) => {
      setDetailsState((previous) => `${previous} ${meta.tokenized}`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [detailsState, taskMentions],
  );

  const handleReset = useCallback(() => {
    setIsTaskCommentsIncluded(false);
    setIsTaskDescriptionIncluded(false);
    setIsTaskDetailsIncluded(false);
    // setDetailsState(EditorState.createEmpty());
  }, []);

  const handleDetailsChange = useCallback(
    (paramters, { value }) => {
      setDetailsState(value);
    },
    [setDetailsState],
  );

  const handleOptionChange = (event) => {
    const { value } = event.target;
    setNoteType(value);
  };

  const EmrOptions = Object.keys(EmrNoteTypeOptions).map((option) => ({
    label: EmrNoteTypeOptions[option],
    value: option,
  }));

  return (
    <ModalWrapper width="600px">
      <CloseIconButton size="small" onClick={() => dispatch(closeModal())}>
        <CloseIcon htmlColor="#C1CCDA" />
      </CloseIconButton>
      <ModalHeaderContainerStyled>
        <ModalHeader>Post note to EHR</ModalHeader>
        <ModalDescription>
          Post a summary to the patient’s health record
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
        <InputContainerStyled>
          <TemplateAutoComplete
            type={CommunicationType.EMR}
            placeholder="Pick template"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onChange={(_event, newValue) => {
              handleReset();
              // const text = addStylesToText(newValue?.body ?? '');
              // setDetailsState(EditorState.push(detailsState, text));
              // setSubject(newValue?.value ?? '');
            }}
            // disabled={show}
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
          <CustomTextEditor label="EHR note">
            <TextEditor
              value={detailsState}
              placeholder="EHR note"
              onChange={handleDetailsChange}
              onBlur={handleDetailsChange}
              enabled={{
                mentions: false,
              }}
            />
          </CustomTextEditor>
        </TextEditorContainerStyled>
      </ModalDescriptionContainer>
      <ModalFooterStyled>
        <Button
          uppercase
          width="150px"
          variant="primary"
          disabled={!detailsState || detailsState === ''}
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
