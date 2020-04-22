import { TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { capitalize } from 'helpers/capitalize';
import EditIcon from 'img/edit.svg';
import palette from 'app/palette';

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
    color: ${palette.unknownGrey1};
    border: 0;
    box-shadow: none;
    background: ${palette.coolGrey4};
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
    fill: ${palette.black};
    height: 22px;
    margin-left: 8px;
    object-fit: contain;
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
  }
`;

const StyledPlaceholderNote = styled(StyledNote)`
  color: ${palette.unknownGrey5};
`;

const NoteValueContainer = styled.span`
  white-space: pre-wrap;
  word-break: break-word;
`;

const EditedLabel = styled.span`
  color: ${palette.unknownGrey5};
  font-size: 0.875rem;
  margin-left: 0.375rem;
  white-space: nowrap;
`;

const StyledNoteStrikethrough = styled.div`
  background-color: ${props =>
    props.hasValue ? palette.unknownGrey1 : palette.unknownGrey5};
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
  identifier,
  placeholder,
  strikethrough = false,
  onNoteChange = () => {},
  edited = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, [setIsEditing]);
  const stopEditing = useCallback(() => {
    setIsEditing(false);
  }, [setIsEditing]);

  const [draft, setDraft] = useState(value);
  useEffect(() => {
    setDraft(capitalize(value));
    stopEditing();
  }, [value, stopEditing]);

  useEffect(() => {
    onNoteChange();
  }, [draft, isEditing, onNoteChange]);

  const handleChange = useCallback(
    event => {
      const { value: updatedDraft } = event.target;
      setDraft(capitalize(updatedDraft));
    },
    [setDraft],
  );

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();
      stopEditing();
      if (draft === value) {
        return;
      }
      onChange(draft, identifier);
    },
    [onChange, stopEditing, draft, value, identifier],
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
        <div>
          <NoteValueContainer>{noteValue}</NoteValueContainer>
          {edited && <EditedLabel>(edited)</EditedLabel>}
          <StyledNoteStrikethrough
            hasValue={Boolean(value)}
            active={strikethrough}
          />
          {!isEditing && !disabled && (
            <StyledEditIconContainer onClick={startEditing}>
              <img src={EditIcon} alt="Edit icon" />
            </StyledEditIconContainer>
          )}
        </div>
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
