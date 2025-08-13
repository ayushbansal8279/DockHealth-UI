import React from 'react';
import { Position } from 'reactflow';
import ApiIcon from '@mui/icons-material/Api';
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

const APINode = ({ data, selected }) => {
  const { label, description, status, url, method, endpoint } = data || {};

  return (
    <NodeContainer
      style={{ border: `2px solid ${palette.blueOcean}` }}
      className={selected ? 'selected' : ''}
    >
      <CustomNodeHandle type="target" position={Position.Top} />

      <NodeHeader>
        <NodeIcon
          style={{
            background: `linear-gradient(45deg, ${palette.blueOcean}, ${palette.purplePassion})`,
          }}
        >
          <ApiIcon fontSize="small" />
        </NodeIcon>
        <NodeTitle>{label || 'Call API'}</NodeTitle>
        {method && <MethodBadge method={method}>{method}</MethodBadge>}
      </NodeHeader>

      <NodeDescription>
        {description || 'Make API call to external service'}
      </NodeDescription>

      {url && (
        <NodeDescription style={{ marginTop: '4px', fontWeight: 500 }}>
          URL: {url.length > 30 ? `${url.substring(0, 30)}...` : url}
        </NodeDescription>
      )}

      {endpoint && (
        <NodeDescription style={{ marginTop: '4px' }}>
          Endpoint: {endpoint}
        </NodeDescription>
      )}

      <CustomNodeHandle type="source" position={Position.Bottom} />
    </NodeContainer>
  );
};

export default APINode;
