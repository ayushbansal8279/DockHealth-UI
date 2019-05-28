import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';

const StyledTextField = styled(TextField).attrs({
  variant: 'outlined',
  autoFocus: true,
  fullWidth: true,
  multiline: true,
  rowsMax: 4,
  InputProps: {
    classes: { root: 'inputRoot' },
  },
})`
  && .inputRoot {
    padding: 0;
  }

  && textarea {
    font-size: 14px;
    color: #303538;
    border: 0;
    box-shadow: none;
    background: rgb(244,244,246);
    border-radius: 4px;
    margin: 0;
    padding: 8px;
    box-sizing: border-box;
  }

  && fieldset {
    border: 0;
    top: 0;
  }
`;

const EditableTextField = ({
  value, onChange, onSubmit, onBlur,
}) => (
  <form onSubmit={onSubmit}>
    <StyledTextField
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
    return <div style={{ whiteSpace: 'pre-wrap' }} onDoubleClick={startEditing}>{value}</div>;
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
