import React, { useState, useEffect } from 'react';
import useBoolean from 'hooks/useBoolean';
import Member from 'components/members/Member';
import Input from './Input';
import { ButtonWrapper, InputBox } from './styled';

const PatientDetailsNoteInput = ({
  disabled,
  onEnterClick,
  placeholder,
  initialValue,
  children,
  closeOnEnter,
  currentUser,
}) => {
  const [shouldShowInput, showInput, hideInput] = useBoolean(false);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    setGroupName(initialValue || '');
  }, [shouldShowInput, initialValue]);

  if (shouldShowInput)
    return (
      <InputBox>
        <Member member={currentUser} size={40} />
        <Input
          onBlur={hideInput}
          onChange={setGroupName}
          onEnter={() => {
            if (closeOnEnter) hideInput();
            return onEnterClick(groupName);
          }}
          placeholder={placeholder}
          value={groupName}
        />
      </InputBox>
    );

  return (
    <ButtonWrapper type="button" onClick={() => !disabled && showInput()}>
      {children}
    </ButtonWrapper>
  );
};

export default PatientDetailsNoteInput;
