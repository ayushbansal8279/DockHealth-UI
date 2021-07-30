/* eslint-disable react-hooks/rules-of-hooks */
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import { EditorState } from 'draft-js';

const initializeAddNoteHooks = () => {
  const currentUser = useSelector(userProfileSelector);
  const [noteState, setNoteState] = useMentionsEditorState();
  const onNoteChange = state => setNoteState(state);
  const clearNote = () => setNoteState(EditorState.createEmpty());
  return {
    currentUser,
    noteState,
    onNoteChange,
    clearNote,
  };
};

export default initializeAddNoteHooks;
