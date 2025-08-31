import React from 'react';
import { Position } from 'reactflow';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
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

const CreatePatientNode = (props) => {
  const { data, selected, id, onEditClick } = props;
  const { label, description, status, firstName, lastName, email } = data || {};
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
          <PersonAddIcon fontSize="small" />
        </NodeIcon>
        <NodeTitle>{label || 'Create Patient'}</NodeTitle>
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
        {description || 'Create a new patient record in the system'}
      </NodeDescription>

      {firstName && lastName && (
        <NodeDescription style={{ marginTop: '4px', fontWeight: 500 }}>
          Name: {firstName} {lastName}
        </NodeDescription>
      )}

      {email && (
        <NodeDescription style={{ marginTop: '4px' }}>
          Email: {email}
        </NodeDescription>
      )}

      <CustomNodeHandle type="source" position={Position.Bottom} />
    </NodeContainer>
  );
};

export default CreatePatientNode;
