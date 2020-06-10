import React, { useState, useEffect } from 'react';
import useBoolean from 'hooks/useBoolean';
import Member from 'components/members/Member';
import { MontserratTypography } from 'styles/theme-montserrat';
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
  const [note, setNote] = useState('');

  useEffect(() => {
    setNote(initialValue || '');
  }, [shouldShowInput, initialValue]);

  if (shouldShowInput)
    return (
      <InputBox>
        <Member member={currentUser} size={40} />
        <Input
          onBlur={hideInput}
          onChange={setNote}
          onEnter={() => {
            if (closeOnEnter) hideInput();
            return onEnterClick(note);
          }}
          placeholder={placeholder}
          value={note}
        />
      </InputBox>
    );

  return (
    <ButtonWrapper type="button" onClick={() => !disabled && showInput()}>
      <MontserratTypography>{children}</MontserratTypography>
    </ButtonWrapper>
  );
};

export default PatientDetailsNoteInput;
