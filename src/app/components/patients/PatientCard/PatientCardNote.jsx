/* eslint-disable import/no-cycle */
import Spacing from 'components/common/Spacing';
import moment from 'moment';
import React from 'react';
import {
  PatientNote,
  NoteDivider,
  NoteDescription,
  NoteInfo,
  PatientNotesWrapper,
  PinnedNotesWrapper,
} from './styled';
import {
  traverseNodes,
  processMarkdownValue,
} from '../../drawer-common/Comment/helpers';

const PatientCardNote = ({ note, index }) => {
  const { identifier, pinned, description, dateUpdated, creator } = note;

  const renderNoteDescription = () => {
    return (
      <>
        <NoteDescription>
          {traverseNodes(processMarkdownValue(description), [])}
        </NoteDescription>
        <NoteInfo>
          {creator?.name} {moment(dateUpdated).format('h:mma M/DD/YY')}
        </NoteInfo>
      </>
    );
  };

  return (
    <PatientNote key={identifier}>
      {index !== 0 && (
        <>
          <Spacing vertical={2} />
          <NoteDivider />
          <Spacing vertical={1} />
        </>
      )}
      {pinned && (
        <PinnedNotesWrapper>{renderNoteDescription()}</PinnedNotesWrapper>
      )}
      {!pinned && (
        <PatientNotesWrapper>{renderNoteDescription()}</PatientNotesWrapper>
      )}
    </PatientNote>
  );
};

export default PatientCardNote;
