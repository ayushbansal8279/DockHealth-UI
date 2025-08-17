import React from 'react';
import { Position } from 'reactflow';
import HttpIcon from '@mui/icons-material/Http';
import {
  NodeContainer,
  NodeHeader,
  NodeIcon,
  NodeTitle,
  NodeDescription,
  CustomNodeHandle,
  MethodBadge,
} from './styled';
import palette from '@/app/styles/palette';

const CallWebhookNode = ({ data, selected }) => {
  const { label, description, status, url, method, timeout } = data || {};

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
          <HttpIcon fontSize="small" />
        </NodeIcon>
        <NodeTitle>{label || 'Call Webhook'}</NodeTitle>
        {method && <MethodBadge method={method}>{method}</MethodBadge>}
      </NodeHeader>

      <NodeDescription>
        {description || 'Make HTTP request to external webhook'}
      </NodeDescription>

      {url && (
        <NodeDescription style={{ marginTop: '4px', fontWeight: 500 }}>
          URL: {url.length > 30 ? `${url.substring(0, 30)}...` : url}
        </NodeDescription>
      )}

      {timeout && (
        <NodeDescription style={{ marginTop: '4px' }}>
          Timeout: {timeout}ms
        </NodeDescription>
      )}

      <CustomNodeHandle type="source" position={Position.Bottom} />
    </NodeContainer>
  );
};

export default CallWebhookNode;
