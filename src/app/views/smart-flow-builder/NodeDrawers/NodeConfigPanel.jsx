import React from 'react';
import {
  ConfigHeader,
  ConfigTitle,
  ConfigActions,
  ConfigPanel,
  ConfigSubPanel,
} from './styled';
import {
  Close,
  Delete,
  Settings,
  Email,
  Psychology,
  Webhook,
  SmartToy,
} from '@mui/icons-material';
import { NodeType } from '@/app/helpers/smart-flow-builder-helpers';
import EmailNodeDrawer from './EmailNodeDrawer';
import styled from 'styled-components';
import WebhookNodeDrawer from './WebhookNodeDrawer';
import AINodeDrawer from './AINodeDrawer';
import palette from '@/app/styles/palette';

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
        return <AINodeDrawer nodeData={data} onUpdate={handleUpdateNodeData} />;

      default:
        return null;
    }
  };

  const getNodeIcon = (nodeType) => {
    const icons = {
      NEW_EMAIL: <Email />,
      NEW_AI_ANALYZER: <Psychology />,
      NEW_AI_ASSISTANT: <SmartToy />,
      NEW_WEBHOOK: <Webhook />,
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
          return `linear-gradient(45deg, ${palette.dirtyBanana}, ${palette.orangeJulius})`;
        case NodeType.NEW_AI_ANALYZER:
        case NodeType.NEW_AI_ASSISTANT:
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
      </ConfigPanel>
    </div>
  );
};

export default NodeConfigPanel;
