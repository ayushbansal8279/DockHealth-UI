import React from 'react';
import { Position } from 'reactflow';
import SmsIcon from '@mui/icons-material/Sms';
import {
  NodeContainer,
  NodeHeader,
  NodeIcon,
  NodeTitle,
  NodeDescription,
  CustomNodeHandle,
} from './styled';
import palette from '@/app/styles/palette';

const SMSNode = ({ data, selected }) => {
  const { label, description, status, recipients, message } = data || {};

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
          <SmsIcon fontSize="small" />
        </NodeIcon>
        <NodeTitle>{label || 'Send SMS'}</NodeTitle>
      </NodeHeader>

      <NodeDescription>
        {description || 'Send SMS notifications to recipients'}
      </NodeDescription>

      <CustomNodeHandle type="source" position={Position.Bottom} />
    </NodeContainer>
  );
};

export default SMSNode;
