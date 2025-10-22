import React from 'react';
import { Position } from '@xyflow/react';
import { AutoAwesome, SmartToy } from '@mui/icons-material';
import {
  NodeContainer,
  NodeHeader,
  NodeIcon,
  NodeTitle,
  NodeDescription,
  CustomNodeHandle,
  AIAnalyzerBadge,
  OptionsContainer,
  GrowButton,
} from './styled';
import palette from '@/app/styles/palette';
import { useDispatch } from 'react-redux';
import { Fab } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteTemporaryElement } from '@/app/actions/task-template-actions';

const AIAssistantNode = (props) => {
  const { data, selected, id, onEditClick } = props;
  const { label, description, status, capability, persona, temperature } =
    data || {};
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
          <SmartToy fontSize="small" />
        </NodeIcon>
        <NodeTitle>{label || 'AI Assistant'}</NodeTitle>
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
