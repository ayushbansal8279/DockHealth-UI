import React from 'react';
import { Position } from 'reactflow';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import {
  NodeContainer,
  NodeHeader,
  NodeIcon,
  NodeTitle,
  NodeDescription,
  CustomNodeHandle,
} from './styled';
import palette from '@/app/styles/palette';

const CreateNoteNode = ({ data, selected }) => {
  const { label, description, status, noteType, patientName, title } = data || {};

  return (
    <NodeContainer
      style={{ border: `2px solid ${palette.orangeJulius}` }}
      className={selected ? 'selected' : ''}
    >
      <CustomNodeHandle type="target" position={Position.Top} />

      <NodeHeader>
        <NodeIcon
          style={{
            background: `linear-gradient(45deg, ${palette.orangeJulius}, ${palette.orangeJulius})`,
          }}
        >
          <NoteAddIcon fontSize="small" />
        </NodeIcon>
        <NodeTitle>{label || 'Create Note'}</NodeTitle>
      </NodeHeader>

      <NodeDescription>
        {description || 'Create a new note or document in the system'}
      </NodeDescription>

      {patientName && (
        <NodeDescription style={{ marginTop: '4px', fontWeight: 500 }}>
          Patient: {patientName}
        </NodeDescription>
      )}

      {noteType && (
        <NodeDescription style={{ marginTop: '4px' }}>
          Type: {noteType}
        </NodeDescription>
      )}

      <CustomNodeHandle type="source" position={Position.Bottom} />
    </NodeContainer>
  );
};

export default CreateNoteNode;
