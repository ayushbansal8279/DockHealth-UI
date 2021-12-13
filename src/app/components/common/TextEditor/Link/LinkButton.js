/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/extensions */
import React, { useCallback, useState, useRef } from 'react';
import LinkIcon from '@material-ui/icons/Link';
import { LinkButtonContainer, LinkButton } from './styled';
import LinkPopover from './LinkPopover';
import {
  createLinkAtSelection,
  removeLinkAtSelection,
  hasEntity,
} from './helpers';

const Link = ({ getEditorState, setEditorState }) => {
  const buttonReference = useRef();
  // const textInputReference = useRef();
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
        const nextEditorState = removeLinkAtSelection(getEditorState());
        setEditorState(nextEditorState);
      } else {
        setPopoverOpen(flag);
      }
    },
    [getEditorState, setEditorState],
  );

  const getInitText = useCallback(() => {
    const selection = getEditorState().getSelection();
    const anchorKey = selection.getAnchorKey();
    const currentContent = getEditorState().getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(anchorKey);
    const start = selection.getStartOffset();
    const end = selection.getEndOffset();
    return currentBlock.getText().slice(start, end);
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
          initText={getInitText()}
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
