/* eslint-disable react-hooks/rules-of-hooks */
import { convertFromEditorStateToOutput } from 'components/common/TextEditor/helpers';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import { EditorState } from 'draft-js';

const initializeAddNotesHooks = () => {
  const currentUser = useSelector(userProfileSelector);
  const [noteState, setNoteState] = useMentionsEditorState();
  const onNoteChange = state => {
    setNoteState(state);
    console.log(
      `currNote: ${convertFromEditorStateToOutput(state, true).rawText}`,
    );
  };
  const clearNote = () => {
    setNoteState(EditorState.createEmpty());
    console.log(`clearing note`);
  };
  return {
    currentUser,
    noteState,
    onNoteChange,
    clearNote,
  };
};

export default initializeAddNotesHooks;
