import { ButtonBase } from '@material-ui/core';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import equals from 'ramda/es/equals';
import take from 'ramda/es/take';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VariableSizeList } from 'react-window';
import styled from 'styled-components';

import { addPatientNote, editPatientNote } from '../../actions/patient-actions';
import { capitalize } from '../../helpers/capitalize';
import {
  onPatientNoteAdded,
  onPatientNoteEdited,
} from '../../helpers/ga-event-helper';
import useBoolean from '../../hooks/useBoolean';
import EditableDescription from '../common/EditableDescription';
import { Cancel, Save, StyledTextField } from './PatientCreation';

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

const EditablePatientNote = ({ update, note, isOwn, style, onNoteChange }) => {
  const noteInfo = `${getCreatorName(note.creator)} | ${formatDate(
    note.dateUpdated,
  )}`;

  const containerReference = useRef(null);

  const onContainerChange = () => {
    const children = [...containerReference.current.children];
    const childrenHeight = children
      .map(child => child.offsetHeight)
      .reduce((accumulator, childHeight) => accumulator + childHeight, 0);
    onNoteChange(childrenHeight);
  };

  return (
    <div ref={containerReference} style={style}>
      <EditableNoteDescription
        placeholder="Enter your note"
        value={note.description || ''}
        name={note.patientNoteId}
        onChange={update}
        disabled={!isOwn}
        onNoteChange={onContainerChange}
      />
      <NoteInfo>{noteInfo}</NoteInfo>
    </div>
  );
};

const CreatorPropertyType = PropTypes.shape({
  firstName: PropTypes.string,
  initials: PropTypes.string,
  lastName: PropTypes.string,
  profileThumbnailPictureHash: PropTypes.string,
  specialtyList: PropTypes.string,
  titleList: PropTypes.string,
  userId: PropTypes.number,
  userName: PropTypes.string,
});

const NotePropertyType = PropTypes.shape({
  creator: CreatorPropertyType,
  dateCreated: PropTypes.string,
  dateUpdated: PropTypes.string,
  description: PropTypes.string,
  patientNoteId: PropTypes.number,
});

EditablePatientNote.propTypes = { note: NotePropertyType.isRequired };

const onNoteChange = ({
  index,
  noteHeightMap,
  setNoteHeightMap,
  notesListReference,
}) => noteHeight => {
  const previousValues = [...noteHeightMap.entries()];
  noteHeightMap.set(index, noteHeight);
  setNoteHeightMap(noteHeightMap);
  const newValues = [...noteHeightMap.entries()];

  if (!equals(previousValues, newValues)) {
    notesListReference.current.resetAfterIndex(0);
  }
};

const PatientNotes = ({ patientId, notes }) => {
  const [isCreating, startCreating, stopCreating] = useBoolean(false);
  const [note, setNote] = useState('');
  const [noteHeightMap, setNoteHeightMap] = useState(new Map());
  const [noteListHeight, setNoteListHeight] = useState(0);
  const dispatch = useDispatch();
  const notesListReference = useRef(null);

  useEffect(() => {
    setNoteHeightMap(new Map());
  }, [patientId]);

  const handleChange = event => {
    setNote(capitalize(event.currentTarget.value));
  };

  const handleCancel = useCallback(() => {
    setNote('');
    stopCreating();
  }, [stopCreating]);

  const handleSubmit = () => {
    dispatch(addPatientNote(patientId, note))
      .then(() => {
        handleCancel();
        onPatientNoteAdded();
      })
      .catch(() => {
        toggleAlert('Error adding note. Please try again.', 'error');
      });
  };

  const handleUpdate = (description, patientNoteId) => {
    const modifiedNote = notes.find(n => n.patientNoteId === patientNoteId);
    dispatch(editPatientNote(patientId, modifiedNote, description))
      .then(() => {
        onPatientNoteEdited();
      })
      .catch(() => {
        toggleAlert('Error updating note. Please try again.', 'error');
      });
  };

  const userId = useSelector(state => state.userState.userProfile.userId);
  const isOwn = patientNote => patientNote.creator.userId === userId;

  useEffect(() => {
    const listHeight = take(5, [...noteHeightMap.keys()])
      .map(key => noteHeightMap.get(key))
      .reduce((accumulator, currentHeight) => accumulator + currentHeight, 0);

    setNoteListHeight(listHeight);
  }, [noteHeightMap]);

  const noteHeightMapValues = [...noteHeightMap.values()];

  useEffect(() => {
    notesListReference.current.resetAfterIndex(0);
  }, [noteHeightMapValues]);

  const getItemSize = index => noteHeightMap.get(index) || 0;

  return (
    <div style={{ padding: '0 12px' }}>
      <VariableSizeList
        height={noteListHeight}
        layout="vertical"
        itemCount={notes.length}
        itemSize={getItemSize}
        width="100%"
        ref={notesListReference}
      >
        {({ index, style }) => {
          const patientNote = notes[index];

          return (
            <EditablePatientNote
              update={handleUpdate}
              note={patientNote}
              isOwn={isOwn(patientNote)}
              noteIndex={index}
              onNoteChange={onNoteChange({
                index,
                noteHeightMap,
                setNoteHeightMap,
                notesListReference,
              })}
              style={style}
            />
          );
        }}
      </VariableSizeList>
      {isCreating ? (
        <div style={{ marginTop: '15px' }}>
          <NoteTextField
            value={note}
            onChange={handleChange}
            multiline
            rows={3}
            hiddenLabel
            style={{ padding: 0 }}
            autoFocus
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginBottom: '16px',
            }}
          >
            <Cancel onClick={handleCancel}>Cancel</Cancel>
            <Save onClick={handleSubmit}>Add note</Save>
          </div>
        </div>
      ) : (
        <AddNote
          onClick={startCreating}
          style={{ marginTop: '18px', marginBottom: '18px' }}
        />
      )}
    </div>
  );
};

PatientNotes.propTypes = { notes: PropTypes.arrayOf(NotePropertyType) };

PatientNotes.defaultProps = { notes: [] };

export default PatientNotes;
