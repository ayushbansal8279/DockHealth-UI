import React, { useState, useEffect } from 'react';
import { EdgeLabel, OutcomeInput } from './styled';

const OutcomeInputLabel = React.forwardRef((props, reference) => {
  const {
    readOnly = true,
    inputRef,
    hasOutcome,
    value,
    onChange,
    onKeyPress,
    onFocus,
    onBlur,
    onClick,
  } = props;

  const [isEditorActive, setEditorActive] = useState(!readOnly);

  useEffect(() => {
    setEditorActive(!readOnly);
    if (inputRef?.current && !readOnly) {
      inputRef?.current?.focus();
    }
  }, [readOnly, inputRef]);

  const handleClick = (event) => {
    setEditorActive(true);
    if (onClick) {
      onClick(event);
    }
    const { current: input } = inputRef;
    if (input) {
      input.focus();
    }
  };

  const handleBlur = (event) => {
    setEditorActive(false);
    if (onBlur) {
      onBlur(event);
    }
  };

  return (
    <EdgeLabel
      ref={reference}
      hasOutcome={hasOutcome}
      placeholder="Type option"
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      onFocus={onFocus}
      onBlur={handleBlur}
      onClick={handleClick}
    >
      {!isEditorActive && (value || 'Type option')}
      <OutcomeInput
        ref={inputRef}
        value={isEditorActive ? value : ''}
        onChange={onChange}
        isEditorActive={isEditorActive}
      />
    </EdgeLabel>
  );
});

export default OutcomeInputLabel;
