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
} from './styled';
import palette from '@/app/styles/palette';

const CreatePatientNode = ({ data, selected }) => {
  const { label, description, status, firstName, lastName, email } = data || {};

  return (
    <NodeContainer
      style={{ border: `2px solid ${palette.green}` }}
      className={selected ? 'selected' : ''}
    >
      <CustomNodeHandle type="target" position={Position.Top} />

      <NodeHeader>
        <NodeIcon
          style={{
            background: `linear-gradient(45deg, ${palette.green}, ${palette.memberGreen})`,
          }}
        >
          <PersonAddIcon fontSize="small" />
        </NodeIcon>
        <NodeTitle>{label || 'Create Patient'}</NodeTitle>
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
