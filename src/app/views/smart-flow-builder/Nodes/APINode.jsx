import React from 'react';
import { Position } from '@xyflow/react';
import ApiIcon from '@mui/icons-material/Api';
import {
  NodeContainer,
  NodeHeader,
  NodeIcon,
  NodeTitle,
  NodeDescription,
  CustomNodeHandle,
  MethodBadge,
  OptionsContainer,
  GrowButton,
} from './styled';
import palette from '@/app/styles/palette';
import { useDispatch } from 'react-redux';
import { Fab } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteTemporaryElement } from '@/app/actions/task-template-actions';

const APINode = (props) => {
  const { data, selected, id, onEditClick } = props;
  const { label, description, status, url, method, endpoint } = data || {};
  const dispatch = useDispatch();

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
          <ApiIcon fontSize="small" />
        </NodeIcon>
        <NodeTitle>{label || 'Call API'}</NodeTitle>
        {method && <MethodBadge method={method}>{method}</MethodBadge>}
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
