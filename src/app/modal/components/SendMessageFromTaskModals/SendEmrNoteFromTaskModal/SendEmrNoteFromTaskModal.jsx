import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { IconButton } from '@mui/material';
import { Replay } from '@mui/icons-material';
import palette from 'styles/palette';
import { closeModal } from 'modal/actions';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
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
import { ConfirmButton } from '../../ModalButton/ModalButtons';

function SendEmrNoteFromTaskModal({ source, identifier, generatedSummary }) {
  const fromAiSummary = source === 'Ai Summary Modal';
  const selectedTask = useSelector(selectedTaskSelector);
  const taskIdentifier = fromAiSummary ? identifier : selectedTask?.identifier;
  const taskMentions = selectedTask?.taskMentions;

  const dispatch = useDispatch();
  const [noteType, setNoteType] = useState('');
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

  useEffect(() => {
    if (fromAiSummary) {
      setDetailsState(generatedSummary);
    }
  }, [fromAiSummary, generatedSummary]);

  const handleReset = useCallback(() => {
    setIsTaskCommentsIncluded(false);
    setIsTaskDescriptionIncluded(false);
    setIsTaskDetailsIncluded(false);
    // setDetailsState(EditorState.createEmpty());
  }, []);

  // const handleDetailsChange = useCallback(
  //   (paramters, { value }) => {
  //     setDetailsState(value);
  //   },
  //   [setDetailsState],
  // );

  const handleOptionChange = (event) => {
    const { value } = event.target;
    setNoteType(value);
  };

  const EmrOptions = Object.keys(EmrNoteTypeOptions).map((option) => ({
    label: EmrNoteTypeOptions[option],
    value: option,
  }));

  const isDisabled = detailsState === '' || noteType === null;

  return (
    <ModalWrapper width="600px">
      <CloseIconButton size="small" onClick={() => dispatch(closeModal())}>
        <CloseIcon htmlColor="#C1CCDA" />
      </CloseIconButton>
      <ModalHeaderContainerStyled>
        <ModalHeader>Post Note to EHR</ModalHeader>
        <ModalDescription>
          Post a summary to the patient's health record
        </ModalDescription>
        <ModalDescription>
          ** Contact Dock Crew to enable this feature **
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
        {!fromAiSummary && (
          <>
            <InputContainerStyled styled={{ textAlign: 'left' }}>
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
          </>
        )}
        <TextEditorContainerStyled>
          <CustomTextEditor label="EHR note">
            <RichTextEditor
              value={detailsState}
              placeholder="EHR note"
              onChange={setDetailsState}
              onBlur={setDetailsState}
              initOnClick
              showCharCount
            />
          </CustomTextEditor>
        </TextEditorContainerStyled>
      </ModalDescriptionContainer>
      <ModalFooterStyled>
        <ConfirmButton
          disabled={isDisabled}
          style={{ width: '270px' }}
          onClick={() => {
            dispatch(
              sendEmrForTask({
                noteType,
                details: detailsState,
                taskIdentifier,
              }),
            );
            dispatch(closeModal());
          }}
        >
          Post
        </ConfirmButton>
      </ModalFooterStyled>
    </ModalWrapper>
  );
}

export default SendEmrNoteFromTaskModal;
