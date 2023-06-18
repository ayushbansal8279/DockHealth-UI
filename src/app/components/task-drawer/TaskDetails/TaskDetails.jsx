import React, {
  useCallback,
  // useEffect,
  // useMemo,
  // useRef,
  // useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useBoolean } from 'hooks/useBoolean';
// import usePrevious from 'hooks/use-previous';
import { updateTaskDetails } from 'actions/task-actions';
// import { checkIfTemplateTask } from 'helpers/task-helpers';
// import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
// import {
//   convertFromEditorStateToOutput,
//   convertToEditorState,
//   isEditorStateEmpty,
// } from 'components/common/TextEditor/helpers';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
// import debounce from 'lodash.debounce';
// import TextArea from 'ui-toolkit/Form/TextArea/TextArea';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import { DetailsContainer } from './styled';

// import FroalaEditor from 'react-froala-wysiwyg';

// import MarkdownIt from 'markdown-it';
// import TurndownService from 'turndown';

// const md = new MarkdownIt();
// const turndownService = new TurndownService();

const TaskDetails = ({ readOnly, disableMentions }) => {
  // const DEBOUNCE_TIME = 10000;
  const selectedTask = useSelector(selectedTaskSelector);
  // const { taskList } = selectedTask || {};
  // const { taskListIdentifier } = taskList || {};
  const dispatch = useDispatch();
  // const detailsReference = useRef(null);
  const [isFocused, setFocused, unsetFocused] = useBoolean();
  // const [detailsState, setDetailsState] = useState(
  //   convertToEditorState({
  //     rawText: selectedTask?.details,
  //     tokenizedText: selectedTask?.tokenizedDetails,
  //     mentions: selectedTask?.taskMentions,
  //     handleRichText: true,
  //   }),
  // );
  // const [rawTextState, setRawTextState] = useState(
  //   selectedTask?.tokenizedDetails,
  // );

  // const [editorState, setEditorState] = useState(
  //   // rawTextState,
  //   md.render(rawTextState || ''),
  // );

  // const isTemplateTask = checkIfTemplateTask(selectedTask);

  // const isEmptyDetailsState = useMemo(
  //   () => isEditorStateEmpty(detailsState),
  //   [detailsState],
  // );

  // const previousIsFocused = usePrevious(isFocused);

  const updateDetails = useCallback(
    (state) => {
      if (selectedTask) {
        //   console.log(4)
        // const { tokenizedText, rawText, mentions } =
        //   convertFromEditorStateToOutput(state, true);
        // const isChangedText = tokenizedText?.trim() !== rawTextState?.trim();
        // if (!rawTextState && tokenizedText.length === 0) return;
        // if (isChangedText) {
        //   setRawTextState(tokenizedText);
        // dispatch(
        //   updateTaskDetails(selectedTask, {
        //     tokenizedDetails: state || '',
        //   }),
        // );
        // }
      }
    },
    [dispatch, selectedTask],
  );

  // const onDebouncedChange = useCallback(
  //   (newState) => {
  //     updateDetails(newState);
  //   },
  //   [updateDetails],
  // );

  // useEffect(() => {
  //   if (previousIsFocused && !isFocused) {
  //     onDebouncedChange.cancel();
  //     updateDetails(detailsState);
  //   }
  // }, [
  //   detailsState,
  //   isFocused,
  //   onDebouncedChange,
  //   previousIsFocused,
  //   updateDetails,
  // ]);

  // const onChangeDetailsEditor = useCallback(
  //   (state, { value }) => {
  //     setDetailsState(value);
  //     onDebouncedChange(value);
  //   },
  //   [onDebouncedChange, setDetailsState],
  // );

  // const handleTextAreaChange = debounce((_, { value }) => {
  //   dispatch(
  //     updateTaskDetails(selectedTask, {
  //       tokenizedDetails: value || '',
  //     }),
  //   );
  // }, 5000);

  const handleBlur = (value) => {
    if (selectedTask?.tokenizedDetails !== value) {
      dispatch(
        updateTaskDetails(selectedTask, {
          tokenizedDetails: value || '',
        }),
      );
    }
  };

  // const config = {
  //   placeholder: 'Edit task details',
  //   listAdvancedTypes: true,
  //   toolbarButtons: [
  //     'bold',
  //     'italic',
  //     'underline',
  //     'strikeThrough',
  //     'subscript',
  //     'superscript',
  //     '|',
  //     'formatOL',
  //     'formatUL',
  //     'outdent',
  //     'indent',
  //     'quote',
  //     'insertLink',
  //     '|',
  //     'undo',
  //     'redo',
  //     'trackChanges',
  //     'markdown',
  //   ],
  //   events: {
  //     // eslint-disable-next-line func-names, object-shorthand, prettier/prettier
  //     'focus': function () {
  //       // eslint-disable-next-line react/no-this-in-sfc
  //       const value = this.html.get();
  //       console.log(`focus: ${value}`);
  //     },
  //     // eslint-disable-next-line func-names, object-shorthand, prettier/prettier
  //     // 'blur': function (e, editor) {
  //     'blur': function () {
  //       // eslint-disable-next-line react/no-this-in-sfc
  //       const value = this.html.get();
  //       console.log(`blur: ${value}`);
  //       const markdown = turndownService.turndown(value);
  //       dispatch(
  //         updateTaskDetails(selectedTask, {
  //           tokenizedDetails: markdown || '',
  //         }),
  //       );
  //     },
  //   },
  // };

  return (
    <DetailsContainer>
      {/* <TextArea
        value={rawTextState}
        placeholder="Task details"
        onChange={handleTextAreaChange}
        onBlur={handleTextAreaBlur}
        mentions={selectedTask?.taskMentions}
        enabled={{
          mentions: true,
        }}
      /> */}
      <CustomTextEditor
        key={selectedTask?.identifier}
        // empty={isEmptyDetailsState}
        focused={isFocused}
        label="Details"
        richTextEnabled
      >
        <RichTextEditor
          value={selectedTask?.tokenizedDetails}
          onBlur={handleBlur}
          initOnClick
          showCharCount
        />
      </CustomTextEditor>
    </DetailsContainer>
  );
};

export default TaskDetails;
