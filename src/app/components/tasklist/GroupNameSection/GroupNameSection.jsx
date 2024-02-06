import React, { useState, useEffect } from 'react';
import { useBoolean } from 'hooks/useBoolean';
import GroupNameInput from '../GroupNameInput/GroupNameInput';
import { ButtonWrapper } from './styled';

const GroupNameSection = ({
  disabled,
  onEnterClick,
  placeholder,
  initialValue,
  children,
  handleInput,
  closeOnEnter,
}) => {
  const [shouldShowInput, showInput, hideInput] = useBoolean(false);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    setGroupName(initialValue || '');
    if (disabled) showInput();
  }, [shouldShowInput, initialValue]);

  if (shouldShowInput)
    return (
      <GroupNameInput
        onBlur={() => {
          hideInput();
          if (handleInput) handleInput(!shouldShowInput);
        }}
        onChange={setGroupName}
        onEnter={() => {
          if (closeOnEnter) hideInput();
          if (handleInput) handleInput(!disabled);
          return onEnterClick(groupName);
        }}
        placeholder={placeholder}
        value={groupName}
      />
    );

  return (
    <ButtonWrapper type="button" onClick={() => !disabled && showInput()}>
      {children}
    </ButtonWrapper>
  );
};

export default GroupNameSection;
