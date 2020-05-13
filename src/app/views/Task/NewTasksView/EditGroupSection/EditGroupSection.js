import React, { useState, useEffect } from 'react';
import useBoolean from 'hooks/useBoolean';
import GroupNameInput from '../GroupNameInput/GroupNameInput';

const EditGroupSection = ({
  onEnterClick,
  placeholder,
  initialValue,
  children,
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
        onEnter={() => onEnterClick(groupName)}
        placeholder={placeholder}
        value={groupName}
      />
    );

  return (
    <button type="button" style={{ textAlign: 'left' }} onClick={showInput}>
      {children}
    </button>
  );
};

export default EditGroupSection;
