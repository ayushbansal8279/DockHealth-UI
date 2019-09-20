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
    font-size: inherit;
    padding: 0;
  }

  && textarea {
    font-size: inherit;
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
  value, onChange, onSubmit, onBlur, placeholder, style,
}) => (
  <form onSubmit={onSubmit}>
    <StyledTextField
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      style={style}
    />
  </form>
);

const EditableDescription = ({ value, onChange, disabled, name, placeholder }) => {
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
      onChange(draft, name);
    }, [onChange, stopEditing, draft, value, name],
  );

  if ((!isEditing || disabled) && value !== '') {
    return <div style={{ whiteSpace: 'pre-wrap' }} onDoubleClick={startEditing}>{value}</div>;
  }

  return (
    <EditableTextField
      value={draft}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onBlur={handleSubmit}
      placeholder={placeholder}
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
