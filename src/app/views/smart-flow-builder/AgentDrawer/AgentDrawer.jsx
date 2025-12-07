import React from 'react';
import ReactDOM from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Close } from '@mui/icons-material';
import { agentDrawerOpenSelector, agentDrawerAgentTypeSelector, agentDrawerTaskDataSelector } from 'selectors/agent-drawer-selectors';
import { closeAgentDrawer, updateAgentTaskData } from 'actions/agent-drawer-actions';
import VoiceAgentNodeDrawer from '../NodeDrawers/VoiceAgentNodeDrawer';
import MissingRecordsAgentNodeDrawer from '../NodeDrawers/MissingRecordsAgentNodeDrawer';
import { AnimatedContainer, DrawerHeader, DrawerTitle, DrawerContent, CloseButton } from './styled';

const AgentDrawer = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(agentDrawerOpenSelector);
  const agentType = useSelector(agentDrawerAgentTypeSelector);
  const taskData = useSelector(agentDrawerTaskDataSelector);

  const handleClose = () => {
    dispatch(closeAgentDrawer());
  };

  const handleUpdate = (updatedData) => {
    dispatch(updateAgentTaskData(updatedData));
    // Here you would typically also update the task with the new data
    console.log('Agent data updated:', updatedData);
  };

  const renderAgentContent = () => {
    switch (agentType) {
      case 'voice':
        return (
          <VoiceAgentNodeDrawer
            nodeData={taskData}
            onUpdate={handleUpdate}
          />
        );
      case 'missing-records':
        return (
          <MissingRecordsAgentNodeDrawer
            nodeData={taskData}
            onUpdate={handleUpdate}
          />
        );
      case 'document-parsing':
        return (
          <div style={{ padding: '20px' }}>
            <h3>Document Parsing Agent Configuration</h3>
            <p>Document Parsing Agent configuration will be implemented here.</p>
            <p>This would include settings for document parsing and analysis.</p>
          </div>
        );
      case 'eligibility':
        return (
          <div style={{ padding: '20px' }}>
            <h3>Eligibility Agent Configuration</h3>
            <p>Eligibility Agent configuration will be implemented here.</p>
            <p>This would include settings for eligibility verification and benefits analysis.</p>
          </div>
        );
      case 'medical-record-gathering':
        return (
          <div style={{ padding: '20px' }}>
            <h3>Medical Record Gathering Agent Configuration</h3>
            <p>Medical Record Gathering Agent configuration will be implemented here.</p>
            <p>This would include settings for medical record collection and organization.</p>
          </div>
        );
      default:
        return (
          <div style={{ padding: '20px' }}>
            <h3>Agent Configuration</h3>
            <p>Unknown agent type: {agentType}</p>
          </div>
        );
    }
  };

  const getAgentTitle = () => {
    const titles = {
      voice: 'Voice Call AI Agent',
      'missing-records': 'Missing Records Agent',
      'document-parsing': 'Document Parsing Agent',
      eligibility: 'Eligibility Agent',
      'medical-record-gathering': 'Medical Record Gathering Agent',
    };
    return titles[agentType] || 'Agent Configuration';
  };

  return ReactDOM.createPortal(
    <div>
      {isOpen && (
        <AnimatedContainer
          style={{
            transform: isOpen ? 'translateX(0%)' : 'translateX(100%)',
          }}
        >
          <DrawerHeader>
            <DrawerTitle>{getAgentTitle()}</DrawerTitle>
            <CloseButton onClick={handleClose}>
              <Close fontSize="small" />
            </CloseButton>
          </DrawerHeader>
          <DrawerContent>
            {renderAgentContent()}
          </DrawerContent>
        </AnimatedContainer>
      )}
    </div>,
    document.body,
  );
};

export default AgentDrawer;
