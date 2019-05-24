import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

const EditableTextField = ({ onSubmit, onChange, value }) => (
  <form onSubmit={onSubmit}>
    <TextField
      onChange={onChange}
      value={value}
      placeholder="Enter task description"
    />
  </form>
);

const EditableDescription = ({ value, onChange, disabled }) => {
  const [isEditing, setIsEditing] = useState(false);
  const startEditing = useCallback(
    () => {
      setIsEditing(true);
    }, [setIsEditing],
  );

  const [draft, setDraft] = useState(value);
  useEffect(
    () => {
      setDraft(value);
      setIsEditing(false);
    }, [value],
  );

  const handleChange = useCallback(
    (e) => {
      const { value: updatedDraft } = e.target;
      setDraft(updatedDraft);
    }, [setDraft],
  );
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (draft === '') { return; }
      setIsEditing(false);
      onChange(draft);
    }, [onChange, setIsEditing, draft],
  );

  if (!isEditing || disabled) {
    return <div onDoubleClick={startEditing}>{value}</div>;
  }

  return (
    <EditableTextField
      value={draft}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
};


EditableDescription.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

EditableDescription.defaultProps = {
  disabled: false,
};

export default EditableDescription;
