import React from 'react';
import { Position } from '@xyflow/react';
import EventIcon from '@mui/icons-material/Event';
import {
  NodeContainer,
  NodeHeader,
  NodeIcon,
  NodeTitle,
  NodeDescription,
  CustomNodeHandle,
} from './styled';
import palette from '@/app/styles/palette';

const UpdateAppointmentNode = ({ data, selected }) => {
  const { label, description, status, appointmentId, updateType, newDateTime } =
    data || {};

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
          <EventIcon fontSize="small" />
        </NodeIcon>
        <NodeTitle>{label || 'Update Appointment'}</NodeTitle>
      </NodeHeader>

      <NodeDescription>
        {description || 'Update existing appointment details'}
      </NodeDescription>

      {appointmentId && (
        <NodeDescription style={{ marginTop: '4px', fontWeight: 500 }}>
          ID: {appointmentId}
        </NodeDescription>
      )}

      {updateType && (
        <NodeDescription style={{ marginTop: '4px' }}>
          Update: {updateType}
        </NodeDescription>
      )}

      <CustomNodeHandle type="source" position={Position.Bottom} />
    </NodeContainer>
  );
};

export default UpdateAppointmentNode;
