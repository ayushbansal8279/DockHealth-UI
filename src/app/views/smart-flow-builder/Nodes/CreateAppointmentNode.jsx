import React from 'react';
import { Position } from 'reactflow';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import {
  NodeContainer,
  NodeHeader,
  NodeIcon,
  NodeTitle,
  NodeDescription,
  CustomNodeHandle,
} from './styled';
import palette from '@/app/styles/palette';

const CreateAppointmentNode = ({ data, selected }) => {
  const { label, description, status, patientName, appointmentType, datetime } = data || {};

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
          <EventAvailableIcon fontSize="small" />
        </NodeIcon>
        <NodeTitle>{label || 'Create Appointment'}</NodeTitle>
      </NodeHeader>

      <NodeDescription>
        {description || 'Schedule a new appointment in the system'}
      </NodeDescription>

      {patientName && (
        <NodeDescription style={{ marginTop: '4px', fontWeight: 500 }}>
          Patient: {patientName}
        </NodeDescription>
      )}

      {appointmentType && (
        <NodeDescription style={{ marginTop: '4px' }}>
          Type: {appointmentType}
        </NodeDescription>
      )}

      <CustomNodeHandle type="source" position={Position.Bottom} />
    </NodeContainer>
  );
};

export default CreateAppointmentNode;
