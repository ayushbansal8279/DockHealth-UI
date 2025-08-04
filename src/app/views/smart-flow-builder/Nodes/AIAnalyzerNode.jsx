import React from 'react';
import { Position } from 'reactflow';
import PsychologyIcon from '@mui/icons-material/Psychology';
import {
  NodeContainer,
  NodeHeader,
  NodeIcon,
  NodeTitle,
  NodeDescription,
  CustomNodeHandle,
} from './styled';
import palette from '@/app/styles/palette';

const AIAnalyzerNode = ({ data, selected }) => {
  const { description, confidence, analysisType } = data || {};

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
          <PsychologyIcon fontSize="small" />
        </NodeIcon>
        <NodeTitle>{'AI Analyzer'}</NodeTitle>
      </NodeHeader>

      <NodeDescription>
        {'Analyze data using artificial intelligence'}
      </NodeDescription>

      {/* {analysisType && (
        <NodeDescription style={{ marginTop: '4px', fontWeight: 500 }}>
          Type: {analysisType}
        </NodeDescription>
      )} */}

      {/* {confidence && (
        <NodeDescription style={{ marginTop: '4px' }}>
          Confidence: {confidence}%
        </NodeDescription>
      )} */}

      <CustomNodeHandle type="source" position={Position.Bottom} />
    </NodeContainer>
  );
};

export default AIAnalyzerNode;
