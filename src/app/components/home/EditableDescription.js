import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

const EditableTextField = ({
  value, onChange, onSubmit, onBlur,
}) => (
  <form onSubmit={onSubmit}>
    <input
      placeholder="Enter task description"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
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
  const stopEditing = useCallback(
    () => {
      setIsEditing(false);
    }, [setIsEditing],
  );

  const [draft, setDraft] = useState(value);
  useEffect(
    () => {
      setDraft(value);
      stopEditing();
    }, [value, stopEditing],
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
      stopEditing();
      if (draft === value) { return; }
      onChange(draft);
    }, [onChange, stopEditing, draft, value],
  );

  if (!isEditing || disabled) {
    return <div onDoubleClick={startEditing}>{value}</div>;
  }

  return (
    <EditableTextField
      value={draft}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onBlur={handleSubmit}
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
