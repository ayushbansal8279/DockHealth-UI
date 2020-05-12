import React, { useState, useEffect } from 'react';
import { MontserratTypography } from 'styles/theme-montserrat';
import useBoolean from 'hooks/useBoolean';
import { Cross, Description, Header } from './styled';
import GroupNameInput from '../GroupNameInput/GroupNameInput';
import messages from './messages';

const AddGroupSection = () => {
  const [shouldShowInput, showInput, hideInput] = useBoolean(false);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    setGroupName('');
  }, [shouldShowInput]);

  if (shouldShowInput)
    return (
      <GroupNameInput
        onBlur={hideInput}
        onChange={setGroupName}
        placeholder={messages.placeholder}
        value={groupName}
      />
    );

  return (
    <>
      <div onClick={showInput}>
        <MontserratTypography>
          <Cross>+</Cross>
          <Header>{messages.label}</Header>
        </MontserratTypography>
      </div>
      <Description>
        <MontserratTypography>{messages.description}</MontserratTypography>
      </Description>
    </>
  );
};

export default AddGroupSection;
