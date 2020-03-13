import { Button, Grid, ThemeProvider, Typography } from '@material-ui/core';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import { editPatientNote } from '../../actions/patient-actions';
import { capitalize } from '../../helpers/capitalize';
import { onPatientNoteEdited } from '../../helpers/ga-event-helper';
import { themeMontserratNormal } from '../../theme-montserrat';
import EditableDescription from '../common/EditableDescription';
import Spacing from '../common/Spacing';
import { StyledTextField } from './PatientCreation';

const NoteTextField = styled(StyledTextField)`
  && {
    .root {
      padding: 12px;
    }
  }
`;

const EditableNoteDescription = styled(EditableDescription)`
  && {
    color: #303538;
  }
`;

const NoteInfo = styled.div`
  font-size: 14px;
  color: #ababb2;
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
        name={note.patientNoteIdentifier}
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
