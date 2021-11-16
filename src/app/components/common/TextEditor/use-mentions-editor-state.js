import { useCallback, useState } from 'react';
import { EditorState, ContentState } from 'draft-js';

export const useMentionsEditorState = initialValue => {
  const [state, setState] = useState(initialValue || EditorState.createEmpty());

  const setMentionsEditorState = useCallback(
    newState => {
      if (!newState) {
        setState(EditorState.push(state, ContentState.createFromText('')));
      } else {
        setState(newState);
      }
    },
    [state],
  );

  const resetState = useCallback(() => {
    setState(EditorState.createEmpty());
  }, []);

  return [state, setMentionsEditorState, resetState];
};

export default useMentionsEditorState;
