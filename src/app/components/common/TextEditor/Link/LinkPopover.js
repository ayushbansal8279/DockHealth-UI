/* eslint-disable import/extensions */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import InputPopover from 'components/common/InputPopover/InputPopover';
import Input from 'components/common/Input/Input';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import { PopoverContainer, TextContainer, ButtonContainer } from './styled';

// eslint-disable-next-line sonarjs/cognitive-complexity
const LinkPopover = ({
  anchorElement,
  isPopoverOpen,
  close,
  onSave,
  initText = '',
}) => {
  const textInputReference = useRef(null);
  const linkInputReference = useRef(null);
  const [formState, setFormState] = useState({ text: initText, link: '' });
  const clearForm = useCallback(() => {
    setFormState({ text: '', link: '' });
  }, [setFormState]);

  useEffect(() => {
    if (isPopoverOpen) {
      setFormState(state => ({ ...state, text: initText }));
    }
  }, [initText, isPopoverOpen]);

  const handleClose = useCallback(() => {
    if (typeof close === 'function') close();
    clearForm();
  }, [close, clearForm]);

  const handleSave = useCallback(() => {
    setTimeout(() => onSave(formState), 0);
    handleClose();
  }, [formState, handleClose, onSave]);

  return (
    <InputPopover
      anchorElement={anchorElement}
      isPopoverOpen={isPopoverOpen}
      style={{ zIndex: 100000 }}
      placement="bottom-start"
      closePopover={handleClose}
      disablePortal
    >
      <PopoverContainer>
        <TextContainer>Create a link</TextContainer>
        <Input
          onClick={event => {
            event.stopPropagation();
            textInputReference.current.focus();
          }}
          inputRef={textInputReference}
          onChange={event =>
            setFormState({ ...formState, text: event.target.value })
          }
          label="Text"
          name="text"
          value={formState.text}
        />
        <Spacing vertical={3} />
        <Input
          onClick={event => {
            event.stopPropagation();
            linkInputReference.current.focus();
          }}
          inputRef={linkInputReference}
          onChange={event =>
            setFormState({ ...formState, link: event.target.value })
          }
          label="Link"
          name="link"
          value={formState.link}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.stopPropagation();
              event.preventDefault();
              handleSave();
            }
          }}
        />
        <ButtonContainer>
          <Button onClick={handleSave}>Save</Button>
          <Spacing horizontal={3} />
          <Button onClick={handleClose}>Cancel</Button>
        </ButtonContainer>
      </PopoverContainer>
    </InputPopover>
  );
};

export default LinkPopover;
