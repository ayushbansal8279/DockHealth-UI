/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/extensions */
import React, { useCallback, useState, useRef, useMemo } from 'react';
import LinkIcon from '@material-ui/icons/Link';
import { Entity, SelectionState, EditorState } from 'draft-js';
import { LinkButtonContainer, LinkButton } from './styled';
import LinkPopover from './LinkPopover';
import { createLinkAtSelection, hasEntity } from './helpers';

const Link = ({ getEditorState, setEditorState }) => {
  const buttonReference = useRef();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleConfirm = useCallback(
    ({ text = '', link = '' }) => {
      setEditorState(createLinkAtSelection(getEditorState(), { text, link }));
    },
    [getEditorState, setEditorState],
  );

  const handleOpen = useCallback(
    flag => {
      if (hasEntity(getEditorState(), 'LINK')) {
        const editorState = getEditorState();
        const selection = editorState?.getSelection();
        if (selection.isCollapsed()) {
          const content = editorState.getCurrentContent();
          const startKey = selection.getStartKey();
          const startOffset = selection.getStartOffset();
          const block = content.getBlockForKey(startKey);
          const entity = block.getEntityAt(startOffset);

          block.findEntityRanges(
            character => character.getEntity() === entity,
            (start, end) => {
              const newSelection = selection.merge({
                anchorOffset: start,
                focusOffset: end,
              });
              const newEditorState = EditorState.acceptSelection(
                editorState,
                newSelection,
              );
              const state = EditorState.forceSelection(
                newEditorState,
                newEditorState.getSelection(),
              );
              setEditorState(state);
            },
          );
        }
        setPopoverOpen(flag);
      } else {
        setPopoverOpen(flag);
      }
    },
    [getEditorState, setEditorState],
  );

  const initText = useMemo(() => {
    const selection = getEditorState().getSelection();
    const anchorKey = selection.getAnchorKey();
    const currentContent = getEditorState().getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(anchorKey);
    const start = selection.getStartOffset();
    const end = selection.getEndOffset();
    return currentBlock.getText().slice(start, end);
  }, [getEditorState]);

  const initLink = useMemo(() => {
    try {
      const editorState = getEditorState();
      const selection = editorState.getSelection();
      const content = editorState.getCurrentContent();
      const startKey = selection.getStartKey();
      const startOffset = selection.getStartOffset();
      const block = content.getBlockForKey(startKey);
      const linkKey = block.getEntityAt(startOffset);
      const linkInstance = Entity.get(linkKey);
      const { url } = linkInstance.getData();

      return url || '';
    } catch {
      return '';
    }
  }, [getEditorState]);

  return (
    <>
      <LinkButtonContainer
        onMouseDown={event => {
          event.preventDefault();
          event.stopPropagation();
        }}
        ref={buttonReference}
      >
        <LinkButton onClick={() => handleOpen(!popoverOpen)}>
          <LinkIcon />
        </LinkButton>
        <LinkPopover
          initText={initText}
          initLink={initLink}
          anchorElement={buttonReference}
          isPopoverOpen={popoverOpen}
          close={() => handleOpen(false)}
          onSave={handleConfirm}
        />
      </LinkButtonContainer>
    </>
  );
};

export default Link;
