import React, { useState, useEffect } from 'react';
import { EdgeLabel, EdgeLabelEditor, EdgeLabelText } from './styled';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';

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
    <>
      {isEditorActive ? (
        <>
          <EdgeLabelEditor
            ref={inputRef}
            autoFocus
            value={isEditorActive ? value : ''}
            placeholder="Type here..."
            onChange={onChange}
            onBlur={handleBlur}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                setEditorActive(false);
              }
              if (typeof onKeyPress === 'function') {
                onKeyPress(event);
              }
            }}
          />
        </>
      ) : (
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
          <Tooltip title={value} key={value} placement="top">
            <EdgeLabelText>
              {!isEditorActive && (value || 'Type option')}
            </EdgeLabelText>
          </Tooltip>
        </EdgeLabel>
      )}
    </>
  );
});

export default OutcomeInputLabel;
