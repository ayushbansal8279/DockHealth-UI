import React, { useState } from 'react';
import { EdgeLabel, OutcomeInput } from './styled';

const OutcomeInputLabel = React.forwardRef((props, reference) => {
  const {
    readOnly,
    inputRef,
    hasOutcome,
    value,
    onChange,
    onKeyPress,
    onFocus,
    onBlur,
    onClick,
  } = props;

  const [isEditorActive, setEditorActive] = useState(false);

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
      readOnly={readOnly}
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
        onBlur={handleBlur}
        isEditorActive={isEditorActive}
      />
    </EdgeLabel>
  );
});

export default OutcomeInputLabel;
