import React, { useState, useEffect } from 'react';
import useBoolean from 'hooks/useBoolean';
import GroupNameInput from '../GroupNameInput/GroupNameInput';
import { ButtonWrapper } from './styled';

const GroupNameSection = ({
  disabled,
  onEnterClick,
  placeholder,
  initialValue,
  children,
  closeOnEnter,
}) => {
  const [shouldShowInput, showInput, hideInput] = useBoolean(false);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    setGroupName(initialValue || '');
  }, [shouldShowInput, initialValue]);

  if (shouldShowInput)
    return (
      <GroupNameInput
        onBlur={hideInput}
        onChange={setGroupName}
        onEnter={() => {
          if (closeOnEnter) hideInput();
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
