import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import { capitalize } from '../../helpers/capitalize';
import EditIcon from '../../img/edit.svg';

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
    background: rgb(244, 244, 246);
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

const StyledEditIconContainer = styled.div`
  && {
    align-items: center;
    display: inline-flex;
    fill: #000;
    height: 22px;
    margin-left: 8px;
    object-fit: contain;
    opacity: 0;
    transition: opacity 0.1s linear;
    vertical-align: bottom;
    width: 18px;

    > img {
      height: 100%;
      width: 100%;
    }
  }
`;

const StyledNote = styled.div`
  display: inline-block;
  position: relative;
  white-space: pre-wrap;
  word-break: break-all;

  &&:hover ${StyledEditIconContainer} {
    cursor: pointer;
    opacity: 1;
  }
`;

const StyledPlaceholderNote = styled(StyledNote)`
  color: #ababb2;
`;

const StyledNoteStrikethrough = styled.div`
  background-color: ${props => (props.hasValue ? '#303538' : '#ababb2')};
  left: 0;
  height: 1px;
  position: absolute;
  top: 50%;
  transition: width 0.3s ease-out 0.1s;
  width: ${props => (props.active ? 100 : 0)}%;
`;

const EditableTextField = ({
  value,
  onChange,
  onSubmit,
  onBlur,
  placeholder,
  style,
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

const EditableDescription = ({
  value,
  onChange,
  disabled,
  name,
  placeholder,
  strikethrough = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const startEditing = useCallback(
    () => {
      setIsEditing(true);
    },
    [setIsEditing],
  );
  const stopEditing = useCallback(
    () => {
      setIsEditing(false);
    },
    [setIsEditing],
  );

  const [draft, setDraft] = useState(value);
  useEffect(
    () => {
      setDraft(capitalize(value));
      stopEditing();
    },
    [value, stopEditing],
  );

  const handleChange = useCallback(
    e => {
      const { value: updatedDraft } = e.target;
      setDraft(capitalize(updatedDraft));
    },
    [setDraft],
  );
  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      stopEditing();
      if (draft === value) {
        return;
      }
      onChange(draft, name);
    },
    [onChange, stopEditing, draft, value, name],
  );

  if (!isEditing || disabled) {
    const { NoteComponent, noteValue } = value
      ? { NoteComponent: StyledNote, noteValue: value }
      : {
          NoteComponent: StyledPlaceholderNote,
          noteValue: 'No note available',
        };

    return (
      <NoteComponent>
        {noteValue}
        {!isEditing && !disabled && (
          <StyledEditIconContainer onClick={startEditing}>
            <img src={EditIcon} alt="Edit icon" />
          </StyledEditIconContainer>
        )}
        <StyledNoteStrikethrough
          hasValue={Boolean(value)}
          active={strikethrough}
        />
      </NoteComponent>
    );
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
