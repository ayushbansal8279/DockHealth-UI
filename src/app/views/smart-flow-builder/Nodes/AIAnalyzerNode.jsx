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
  OptionsContainer,
  GrowButton,
} from './styled';
import palette from '@/app/styles/palette';
import { useDispatch } from 'react-redux';
import { Fab } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteTemporaryElement } from '@/app/actions/task-template-actions';

const AIAnalyzerNode = (props) => {
  const { data, selected, id, onEditClick } = props;
  const { description, confidence, analysisType } = data || {};
  const dispatch = useDispatch();

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
