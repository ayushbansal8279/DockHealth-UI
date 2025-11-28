import React from 'react';
import { AutoAwesome, Description } from '@mui/icons-material';
import {
  NodeContainer,
  NodeHeader,
  NodeIcon,
  NodeTitle,
  NodeDescription,
  AIAnalyzerBadge,
} from './styled';
import palette from '@/app/styles/palette';
import TaskNodeHandles from '../TaskNodeHandles/TaskNodeHandles';

const DocumentParsingAgentNode = ({ data, selected, isConnectable }) => {
  const { label, description, status, capability, persona, temperature } =
    data || {};

  return (
    <TaskNodeHandles
      isConnectable={isConnectable}
      isConnecting={data.draggedEdgeSourceId}
      onTargetHandleHover={data.onTargetHandleHover}
      draggedEdgeSourceId={data?.draggedEdgeSourceId}
    >
      <NodeContainer
        style={{ border: `2px solid ${palette.tomatoInYoFace}` }}
        className={selected ? 'selected' : ''}
      >
        <NodeHeader>
          <NodeIcon
            style={{
              background: `linear-gradient(45deg, ${palette.tomatoInYoFace}, ${palette.oPlusRed})`,
            }}
          >
            <Description fontSize="small" />
          </NodeIcon>
          <NodeTitle>{label || 'Document Parsing Agent'}</NodeTitle>
        </NodeHeader>

        <NodeDescription>
          {description || 'Intelligent document parsing and analysis'}
        </NodeDescription>

        {capability && (
          <AIAnalyzerBadge>
            <AutoAwesome style={{ fontSize: 14 }} />
            {capability}
          </AIAnalyzerBadge>
        )}
      </NodeContainer>
    </TaskNodeHandles>
  );
};

export default DocumentParsingAgentNode;
