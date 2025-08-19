import React from 'react';
import { Position } from 'reactflow';
import { AutoAwesome, SmartToy } from '@mui/icons-material';
import {
  NodeContainer,
  NodeHeader,
  NodeIcon,
  NodeTitle,
  NodeDescription,
  CustomNodeHandle,
  AIAnalyzerBadge,
} from './styled';
import palette from '@/app/styles/palette';

const AIAssistantNode = ({ data, selected }) => {
  const { label, description, status, capability, persona, temperature } =
    data || {};

  return (
    <NodeContainer
      style={{ border: `2px solid ${palette.tomatoInYoFace}` }}
      className={selected ? 'selected' : ''}
    >
      <CustomNodeHandle type="target" position={Position.Top} />

      <NodeHeader>
        <NodeIcon
          style={{
            background: `linear-gradient(45deg, ${palette.tomatoInYoFace}, ${palette.oPlusRed})`,
          }}
        >
          <SmartToy fontSize="small" />
        </NodeIcon>
        <NodeTitle>{label || 'AI Assistant'}</NodeTitle>
      </NodeHeader>

      <NodeDescription>
        {description || 'Intelligent AI assistant for task automation'}
      </NodeDescription>

      {capability && (
        <AIAnalyzerBadge>
          <AutoAwesome style={{ fontSize: 14 }} />
          {capability}
        </AIAnalyzerBadge>
      )}

      <CustomNodeHandle type="source" position={Position.Bottom} />
    </NodeContainer>
  );
};

export default AIAssistantNode;
