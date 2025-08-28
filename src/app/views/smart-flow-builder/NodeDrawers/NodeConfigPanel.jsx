import React from 'react';
import {
  ConfigHeader,
  ConfigTitle,
  ConfigActions,
  ConfigPanel,
  ConfigSubPanel,
  ConfigButtonWrapper,
} from './styled';
import {
  Close,
  Delete,
  Settings,
  Email,
  Psychology,
  Webhook,
  SmartToy,
  Description,
  VerifiedUser,
  FolderOpen,
  FindInPage,
  RecordVoiceOver,
  Sms,
  Http,
  Api,
  PersonAdd,
  EventAvailable,
  Event,
  NoteAdd,
} from '@mui/icons-material';
import { NodeType } from '@/app/helpers/smart-flow-builder-helpers';
import EmailNodeDrawer from './EmailNodeDrawer';
import styled from 'styled-components';
import WebhookNodeDrawer from './WebhookNodeDrawer';
import AINodeDrawer from './AINodeDrawer';
import VoiceAgentNodeDrawer from './VoiceAgentNodeDrawer';
import MissingRecordsAgentNodeDrawer from './MissingRecordsAgentNodeDrawer';
import SMSNodeDrawer from './SMSNodeDrawer';
import CallWebhookNodeDrawer from './CallWebhookNodeDrawer';
import APINodeDrawer from './APINodeDrawer';
import CreatePatientNodeDrawer from './CreatePatientNodeDrawer';
import CreateAppointmentNodeDrawer from './CreateAppointmentNodeDrawer';
import UpdateAppointmentNodeDrawer from './UpdateAppointmentNodeDrawer';
import CreateNoteNodeDrawer from './CreateNoteNodeDrawer';
import palette from '@/app/styles/palette';
import {
  ConfirmButton,
  CancelButton,
} from '@/app/modal/components/ModalButton/ModalButtons';

const NodeConfigPanel = ({ selectedNode, handleUpdateNodeData, onClose }) => {
  if (!selectedNode) return null;

  const { type, data } = selectedNode;

  const renderNodeSpecificConfig = () => {
    switch (type) {
      case NodeType.NEW_EMAIL:
        return (
          <EmailNodeDrawer nodeData={data} onUpdate={handleUpdateNodeData} />
        );

      case NodeType.NEW_WEBHOOK:
        return (
          <WebhookNodeDrawer nodeData={data} onUpdate={handleUpdateNodeData} />
        );

      case NodeType.NEW_AI_ANALYZER:
      case NodeType.NEW_AI_ASSISTANT:
      case NodeType.NEW_DOCUMENT_PARSING_AGENT:
      case NodeType.NEW_ELIGIBILITY_AGENT:
      case NodeType.NEW_MEDICAL_RECORD_GATHERING_AGENT:
        return <AINodeDrawer nodeData={data} onUpdate={handleUpdateNodeData} />;
      case NodeType.NEW_MISSING_RECORDS_AGENT:
        return <MissingRecordsAgentNodeDrawer nodeData={data} onUpdate={handleUpdateNodeData} />;
      case NodeType.NEW_VOICE_AGENT:
        return <VoiceAgentNodeDrawer nodeData={data} onUpdate={handleUpdateNodeData} />;

      case NodeType.NEW_SEND_SMS:
        return (
          <SMSNodeDrawer nodeData={data} onUpdate={handleUpdateNodeData} />
        );

      case NodeType.NEW_CALL_API:
        return (
          <APINodeDrawer nodeData={data} onUpdate={handleUpdateNodeData} />
        );

      case NodeType.NEW_CREATE_PATIENT:
        return (
          <CreatePatientNodeDrawer
            nodeData={data}
            onUpdate={handleUpdateNodeData}
          />
        );

      case NodeType.NEW_CREATE_APPOINTMENT:
        return (
          <CreateAppointmentNodeDrawer
            nodeData={data}
            onUpdate={handleUpdateNodeData}
          />
        );

      case NodeType.NEW_UPDATE_APPOINTMENT:
        return (
          <UpdateAppointmentNodeDrawer
            nodeData={data}
            onUpdate={handleUpdateNodeData}
          />
        );

      case NodeType.NEW_CREATE_NOTE:
        return (
          <CreateNoteNodeDrawer
            nodeData={data}
            onUpdate={handleUpdateNodeData}
          />
        );

      default:
        return null;
    }
  };

  const getNodeIcon = (nodeType) => {
    const icons = {
      NEW_EMAIL: <Email />,
      NEW_AI_ANALYZER: <Psychology />,
      NEW_AI_ASSISTANT: <SmartToy />,
      NEW_DOCUMENT_PARSING_AGENT: <Description />,
      NEW_ELIGIBILITY_AGENT: <VerifiedUser />,
      NEW_MEDICAL_RECORD_GATHERING_AGENT: <FolderOpen />,
      NEW_MISSING_RECORDS_AGENT: <FindInPage />,
      NEW_VOICE_AGENT: <RecordVoiceOver />,
      NEW_WEBHOOK: <Webhook />,
      NEW_SEND_SMS: <Sms />,
      NEW_CALL_API: <Api />,
      NEW_CREATE_PATIENT: <PersonAdd />,
      NEW_CREATE_APPOINTMENT: <EventAvailable />,
      NEW_UPDATE_APPOINTMENT: <Event />,
      NEW_CREATE_NOTE: <NoteAdd />,
    };
    return icons[nodeType] || <Settings />;
  };

  const NodeIcon = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: ${({ type }) => {
      switch (type) {
        case NodeType.NEW_EMAIL:
        case NodeType.NEW_WEBHOOK:
        case NodeType.NEW_SEND_SMS:
        case NodeType.NEW_CALL_API:
        case NodeType.NEW_CREATE_PATIENT:
        case NodeType.NEW_CREATE_NOTE:
        case NodeType.NEW_CREATE_APPOINTMENT:
        case NodeType.NEW_UPDATE_APPOINTMENT:
          return `linear-gradient(45deg, ${palette.dirtyBanana}, ${palette.orangeJulius})`;
        case NodeType.NEW_AI_ANALYZER:
        case NodeType.NEW_AI_ASSISTANT:
        case NodeType.NEW_DOCUMENT_PARSING_AGENT:
        case NodeType.NEW_ELIGIBILITY_AGENT:
        case NodeType.NEW_MEDICAL_RECORD_GATHERING_AGENT:
        case NodeType.NEW_MISSING_RECORDS_AGENT:
        case NodeType.NEW_VOICE_AGENT:
          return `linear-gradient(45deg, ${palette.tomatoInYoFace}, ${palette.oPlusRed})`;
        default:
          return `linear-gradient(45deg, ${palette.blueOcean}, ${palette.purplePassion})`;
      }
    }};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  `;

  const renderNodeIcon = () => {
    return <NodeIcon type={type}>{getNodeIcon(type)}</NodeIcon>;
  };

  const getNodeTitle = () => {
    const titles = {
      NEW_EMAIL: 'Send Email',
      NEW_WEBHOOK: 'Webhook',
      NEW_AI_ANALYZER: 'AI Analyzer',
      NEW_AI_ASSISTANT: 'AI Assistant',
      NEW_DOCUMENT_PARSING_AGENT: 'Document Parsing Agent',
      NEW_ELIGIBILITY_AGENT: 'Eligibility Agent',
      NEW_MEDICAL_RECORD_GATHERING_AGENT: 'Medical Record Gathering Agent',
      NEW_MISSING_RECORDS_AGENT: 'Missing Records Agent',
      NEW_VOICE_AGENT: 'Voice Call AI Agent',
      NEW_SEND_SMS: 'Send SMS',
      NEW_CALL_API: 'Call API',
      NEW_CREATE_PATIENT: 'Create Patient',
      NEW_CREATE_APPOINTMENT: 'Create Appointment',
      NEW_UPDATE_APPOINTMENT: 'Update Appointment',
      NEW_CREATE_NOTE: 'Create Note',
    };
    return titles[type] || 'Configure Node';
  };

  return (
    <div>
      <ConfigPanel>
        <ConfigHeader>
          <ConfigTitle>
            {renderNodeIcon()}
            {getNodeTitle()}
          </ConfigTitle>
          <ConfigActions>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                color: '#64748b',
              }}
            >
              <Close fontSize="small" />
            </button>
          </ConfigActions>
        </ConfigHeader>
        <ConfigSubPanel>{renderNodeSpecificConfig()}</ConfigSubPanel>
        <ConfigButtonWrapper>
          <ConfirmButton>Save</ConfirmButton>
          <CancelButton>Cancel</CancelButton>
        </ConfigButtonWrapper>
      </ConfigPanel>
    </div>
  );
};

export default NodeConfigPanel;
