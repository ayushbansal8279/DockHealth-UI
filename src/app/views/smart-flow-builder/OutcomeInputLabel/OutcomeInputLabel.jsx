import React from 'react';
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

  return (
    <EdgeLabel ref={reference} hasOutcome={hasOutcome}>
      <OutcomeInput
        ref={inputRef}
        readOnly={readOnly}
        placeholder="Type option"
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
      />
    </EdgeLabel>
  );
});

export default OutcomeInputLabel;
