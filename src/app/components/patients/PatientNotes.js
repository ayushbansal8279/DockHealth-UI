import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import * as PropTypes from 'prop-types';
import moment from 'moment';
import { ButtonBase } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import useBoolean from '../../helpers/useBoolean';
import { Cancel, Save, StyledTextField } from './PatientCreation';
import { addPatientNote, editPatientNote } from '../../actions/patient-actions';
import EditableDescription from '../home/EditableDescription';
import { capitalize } from '../../helpers/capitalize';

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

const AddNote = styled(ButtonBase).attrs(() => ({
  children: '+ Add a note',
}))`
  && {
    font-size: 14px;
    color: #13a7d1;
    padding: 8px;
    margin-left: -8px;
    border-radius: 4px;
    font-weight: 600;
  }
`;

const getCreatorName = creator => `${creator.firstName} ${creator.lastName}`;

const formatDate = date => moment(date).format('dddd, MMMM Do');

const EditablePatientNote = ({ update, note, isOwn, style }) => (
  <div style={style}>
    <EditableNoteDescription
      placeholder="Enter your note"
      value={note.description || '—'}
      name={note.patientNoteId}
      onChange={update}
      disabled={!isOwn}
    />
    <NoteInfo>
      {`${getCreatorName(note.creator)} | ${formatDate(note.dateUpdated)}`}
    </NoteInfo>
  </div>
);

const CreatorPropType = PropTypes.shape({
  firstName: PropTypes.string,
  initials: PropTypes.string,
  lastName: PropTypes.string,
  profileThumbnailPictureHash: PropTypes.string,
  specialtyList: PropTypes.string,
  titleList: PropTypes.string,
  userId: PropTypes.number,
  userName: PropTypes.string,
});
const NotePropType = PropTypes.shape({
  creator: CreatorPropType,
  dateCreated: PropTypes.string,
  dateUpdated: PropTypes.string,
  description: PropTypes.string,
  patientNoteId: PropTypes.number,
});

EditablePatientNote.propTypes = { note: NotePropType.isRequired };

const PatientNotes = ({ patientId, notes }) => {
  const [isCreating, startCreating, stopCreating] = useBoolean(false);
  const [note, setNote] = useState('');
  const handleChange = (e) => {
    setNote(capitalize(e.currentTarget.value));
  };
  const handleCancel = useCallback(() => {
    setNote('');
    stopCreating();
  }, [stopCreating]);
  const dispatch = useDispatch();
  const handleSubmit = () => {
    dispatch(addPatientNote(patientId, note))
      .then(() => { handleCancel(); })
      .catch(() => { toggleAlert('Error adding note. Please try again.', 'error'); });
  };
  const handleUpdate = (description, patientNoteId) => {
    const modifiedNote = notes.find(n => n.patientNoteId == patientNoteId);
    dispatch(editPatientNote(patientId, modifiedNote, description))
      .catch(() => { toggleAlert('Error updating note. Please try again.', 'error'); });
  };

  const userId = useSelector(state => state.userState.userProfile.userId);
  const isOwn = note => note.creator.userId === userId;

  return (
    <div style={{ background: 'rgba(243,245,246,0.5)', padding: '7px 12px' }}>
      <div style={{
        color: '#ABABB2',
        fontSize: '12px',
        lineHeight: '12px',
      }}
      >
        Notes
      </div>
      {notes.map(note => <EditablePatientNote update={handleUpdate} note={note} isOwn={isOwn(note)} style={{ marginTop: '12px' }} />)}
      {isCreating
        ? (
          <div style={{ marginTop: '15px' }}>
            <NoteTextField
              value={note}
              onChange={handleChange}
              multiline
              rows={3}
              hiddenLabel
              style={{ padding: 0 }}
            />
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginBottom: '16px',
            }}
            >
              <Cancel onClick={handleCancel}>Cancel</Cancel>
              <Save onClick={handleSubmit}>
              Add note
              </Save>
            </div>
          </div>
        )
        : <AddNote onClick={startCreating} style={{ marginTop: '18px', marginBottom: '18px' }} />}
    </div>
  );
};

PatientNotes.propTypes = { notes: PropTypes.arrayOf(NotePropType) };

PatientNotes.defaultProps = { notes: [] };

export default PatientNotes;
