import React from 'react';
import { Position } from 'reactflow';
import EmailIcon from '@mui/icons-material/Email';
import {
  NodeContainer,
  NodeHeader,
  NodeIcon,
  NodeTitle,
  NodeDescription,
  CustomNodeHandle,
} from './styled';
import palette from '@/app/styles/palette';

const EmailNode = ({ data, selected }) => {
  const { label, description, status, recipients, subject } = data || {};

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
          <EmailIcon fontSize="small" />
        </NodeIcon>
        <NodeTitle>{label || 'Send Email'}</NodeTitle>
      </NodeHeader>

      <NodeDescription>
        {description || 'Send email notifications to recipients'}
      </NodeDescription>

      {/* {subject && (
        <NodeDescription style={{ marginTop: '4px', fontWeight: 500 }}>
          Subject: {subject}
        </NodeDescription>
      )} */}

      {/* {recipients && (
        <NodeDescription style={{ marginTop: '4px' }}>
          To: {Array.isArray(recipients) ? recipients.join(', ') : recipients}
        </NodeDescription>
      )} */}

      <CustomNodeHandle type="source" position={Position.Bottom} />
    </NodeContainer>
  );
};

export default EmailNode;
