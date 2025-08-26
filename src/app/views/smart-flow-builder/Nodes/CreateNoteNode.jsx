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
  OptionsContainer,
  GrowButton,
} from './styled';
import palette from '@/app/styles/palette';
import { useDispatch } from 'react-redux';
import { Fab } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteTemporaryElement } from '@/app/actions/task-template-actions';

const CreateNoteNode = (props) => {
  const { data, selected, id, onEditClick } = props;
  const { label, description, status, noteType, patientName, title } =
    data || {};
  const dispatch = useDispatch();

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
        <OptionsContainer>
          <GrowButton key="delete" index={0}>
            <Fab
              key="delete"
              aria-label="delete"
              size="small"
              onClick={() => dispatch(deleteTemporaryElement(id))}
            >
              <DeleteIcon fontSize="small" color="inherit" />
            </Fab>
          </GrowButton>
          <GrowButton key="edit" index={1}>
            <Fab
              key="edit"
              aria-label="edit"
              size="small"
              onClick={() => onEditClick(props)}
            >
              <EditIcon fontSize="small" color="inherit" />
            </Fab>
          </GrowButton>
        </OptionsContainer>
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
