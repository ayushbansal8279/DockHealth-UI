import { Button, Grid, TextField, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import { editPatientNote } from 'actions/patient-actions';
import { capitalize } from 'helpers/capitalize';
import { onPatientNoteEdited } from 'helpers/ga-event-helper';
import palette, { opacify } from 'app/palette';
import { themeMontserratNormal } from 'app/theme-montserrat';
import EditableDescription from '../common/EditableDescription';
import Spacing from '../common/Spacing';

const NoteTextField = styled(({ InputProps, InputLabelProps, ...rest }) => (
  <TextField
    {...rest}
    variant="filled"
    margin="dense"
    fullWidth
    spellCheck={false}
    autoComplete={uuid()}
    InputProps={{
      ...InputProps,
      spellCheck: false,
      classes: { root: 'root', disabled: 'disabled' },
    }}
    InputLabelProps={{
      ...InputLabelProps,
      classes: { shrink: 'shrink', asterisk: 'asterisk', error: 'error' },
    }}
  />
))`
  && {
    margin-top: 4px;
    margin-bottom: 0;

    input,
    textarea {
      height: inherit;
      box-shadow: none;
      color: ${palette.greyBlue};
      :focus {
        border: none;
        background: none;
      }
      :disabled {
        background: none;
        cursor: default;
      }
    }

    & .MuiFilledInput-underline {
      &::after,
      &::before {
        border: 0 !important;
      }
    }

    .root {
      background-color: ${opacify(palette.lightGrey, 0.5)};
      padding: 12px;
    }

    .disabled {
      color: ${palette.greyBlue};
    }

    .asterisk {
      color: ${palette.error};
    }

    .shrink {
      color: ${palette.unknownGrey5};
    }

    .error {
      color: ${palette.error};
      background: none;
    }

    label {
      color: ${palette.greyBlue};
    }
  }
`;

const EditableNoteDescription = styled(EditableDescription)`
  && {
    color: ${palette.unknownGrey1};
  }
`;

const NoteInfo = styled.div`
  font-size: 14px;
  color: ${palette.unknownGrey5};
`;

const AddNote = props => (
  <Button variant="text" size="small" {...props}>
    <ThemeProvider theme={themeMontserratNormal}>
      <Typography variant="h4">+ Add a note</Typography>
    </ThemeProvider>
  </Button>
);

const NotesContainer = styled.div`
  max-height: 14rem;
  overflow-y: auto;
`;

const getCreatorName = creator => `${creator.firstName} ${creator.lastName}`;

const formatDate = date => moment(date).format('dddd, MMMM Do');

const isNoteEdited = ({ dateCreated, dateUpdated }) =>
  dateCreated !== dateUpdated;

const EditablePatientNote = ({ update, note, isOwn }) => {
  const noteInfo = `${getCreatorName(note.creator)} | ${formatDate(
    note.dateUpdated,
  )}`;

  return (
    <>
      <EditableNoteDescription
        placeholder="Enter your note"
        value={note.description || ''}
        identifier={note.patientNoteIdentifier}
        onChange={update}
        disabled={!isOwn}
        edited={isNoteEdited(note)}
      />
      <NoteInfo>{noteInfo}</NoteInfo>
    </>
  );
};

const CreatorPropertyType = PropTypes.shape({
  firstName: PropTypes.string,
  initials: PropTypes.string,
  lastName: PropTypes.string,
  profileThumbnailPictureHash: PropTypes.string,
  specialtyList: PropTypes.string,
  titleList: PropTypes.string,
  userIdentifier: PropTypes.string,
  userName: PropTypes.string,
});

const NotePropertyType = PropTypes.shape({
  creator: CreatorPropertyType,
  dateCreated: PropTypes.string,
  dateUpdated: PropTypes.string,
  description: PropTypes.string,
  patientNoteIdentifier: PropTypes.string,
});

EditablePatientNote.propTypes = { note: NotePropertyType.isRequired };

const PatientNotes = ({
  patientIdentifier,
  notes,
  note,
  setNote,
  isCreating,
  handleCancel,
  handleSubmit,
  startCreating,
}) => {
  const dispatch = useDispatch();

  const handleChange = event => {
    setNote(capitalize(event.currentTarget.value));
  };

  const handleUpdate = (description, patientNoteIdentifier) => {
    const modifiedNote = notes.find(
      n => n.patientNoteIdentifier === patientNoteIdentifier,
    );

    dispatch(editPatientNote(patientIdentifier, modifiedNote, description))
      .then(() => {
        onPatientNoteEdited();
        toggleAlert('Note updated successfully', 'success');
      })
      .catch(() => {
        toggleAlert('Error updating note. Please try again.', 'error');
      });
  };

  const userIdentifier = useSelector(
    state => state.userState.userProfile.userIdentifier,
  );

  const isOwn = patientNote =>
    patientNote.creator.userIdentifier === userIdentifier;

  return (
    <div>
      <NotesContainer>
        {notes?.length > 0 ? (
          notes.map(patientNote => (
            <EditablePatientNote
              update={handleUpdate}
              note={patientNote}
              isOwn={isOwn(patientNote)}
              key={patientNote.patientNoteIdentifier}
            />
          ))
        ) : (
          <Typography variant="body1">
            No notes available for this patient
          </Typography>
        )}
      </NotesContainer>
      {isCreating ? (
        <>
          <Spacing vertical={4} />
          <NoteTextField
            value={note}
            onChange={handleChange}
            multiline
            rows={3}
            hiddenLabel
            style={{ padding: 0 }}
            autoFocus
            autoComplete={uuid()}
          />
          <Spacing vertical={4} />
          <Grid container justify="flex-end">
            <Button variant="text" size="small" onClick={handleCancel}>
              Cancel
            </Button>
            <Spacing horizontal={3} />
            <Button variant="contained" size="small" onClick={handleSubmit}>
              Add note
            </Button>
          </Grid>
        </>
      ) : (
        <>
          <Spacing vertical={4} />
          <AddNote onClick={startCreating} />
        </>
      )}
    </div>
  );
};

PatientNotes.propTypes = { notes: PropTypes.arrayOf(NotePropertyType) };

PatientNotes.defaultProps = { notes: [] };

export default PatientNotes;
