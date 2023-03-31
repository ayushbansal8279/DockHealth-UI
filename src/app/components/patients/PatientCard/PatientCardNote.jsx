/* eslint-disable import/no-cycle */
import Spacing from 'components/common/Spacing';
import { convertToEditorState } from 'components/common/TextEditor/helpers';
import TextEditor from 'components/common/TextEditor/TextEditor';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import {
  PatientNote,
  NoteDivider,
  NoteDescription,
  NoteInfo,
  PatientNotesWrapper,
  PinnedNotesWrapper,
} from './styled';

const PatientCardNote = ({ note, patientName, index }) => {
  const { identifier, pinned, description, dateUpdated } = note;
  const initialState = useMemo(
    () =>
      convertToEditorState({
        tokenizedText: description,
        rawText: description,
        mentions: [],
        handleRichText: true,
      }),
    [description],
  );
  const [noteState, setNoteState] = useState(initialState);

  const renderNoteDescription = () => {
    return (
      <>
        <NoteDescription>
            woah
          <TextEditor
            readOnly
            disableMentions
            isDrawerEditor
            state={noteState}
            onChange={(newState) => setNoteState(newState)}
          />
        </NoteDescription>
        <NoteInfo>
          {patientName} {moment(dateUpdated).format('h:mma M/DD/YY')}
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
