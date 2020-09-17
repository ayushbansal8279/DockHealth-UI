import { useCallback, useState } from 'react';
import { EditorState } from 'draft-js';

export const useMentionsEditorState = initialValue => {
  const [state, setState] = useState(initialValue || EditorState.createEmpty());

  const setMentionsEditorState = useCallback(newState => {
    if (!newState) {
      setState(EditorState.createEmpty());
    } else {
      setState(newState);
    }
  }, []);

  return [state, setMentionsEditorState];
};

export default useMentionsEditorState;
