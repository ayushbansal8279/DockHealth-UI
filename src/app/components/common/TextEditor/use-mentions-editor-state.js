import { useCallback, useState } from 'react';
// import { EditorState, ContentState } from 'draft-js';

export const useMentionsEditorState = (initialValue) => {
  // const [state, setState] = useState(initialValue || EditorState.createEmpty());
  const [state, setState] = useState(initialValue);

  const setMentionsEditorState = useCallback(
    (newState) => {
      if (newState) {
        setState(newState);
      } else {
        // setState(EditorState.push(state, ContentState.createFromText('')));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state],
  );

  const resetState = useCallback(() => {
    // eslint-disable-next-line no-undef
    setState(EditorState.createEmpty());
  }, []);

  return [state, setMentionsEditorState, resetState];
};

export default useMentionsEditorState;
