import { useCallback, useState } from 'react';
import { EditorState } from 'draft-js';

export const useMentionsEditorState = initialValue => {
  const [state, setState] = useState(initialValue || EditorState.createEmpty());

  const setMentionsInputState = useCallback(newState => {
    if (!newState) {
      setState(EditorState.createEmpty());
    } else {
      setState(newState);
    }
  }, []);

  return [state, setMentionsInputState];
};

export default useMentionsEditorState;
