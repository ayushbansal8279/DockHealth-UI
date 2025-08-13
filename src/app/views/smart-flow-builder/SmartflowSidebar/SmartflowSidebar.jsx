import React from 'react';
import {
  AccountTree as DecisionIcon,
  Email as EmailIcon,
  Webhook as WebhookIcon,
  Psychology as AIIcon,
  SmartToy as AIAssistantIcon,
  AutoFixHigh as AutoAlignIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Sms as SmsIcon,
  PersonAdd as PersonAddIcon,
  EventAvailable as EventAvailableIcon,
  NoteAdd as NoteAddIcon,
  Call as CallIcon,
} from '@mui/icons-material';
import { Popper, ClickAwayListener, Paper } from '@mui/material';

import {
  ElementsSidebar,
  SidebarHeader,
  SidebarTitle,
  SidebarSubtitle,
  SidebarContent,
  CategorySection,
  CategoryTitle,
  ElementButton,
  ElementIconBackground,
  ElementInfo,
  ElementTitle,
  ElementDescription,
  TaskElementIcon,
  AutomationTaskIcon,
  AutoAlignButton,
  UtilitySection,
} from '../styled';

import WorkflowLinkIcon from 'img/template/workflow-icon';
import { NodeType } from 'helpers/smart-flow-builder-helpers';
import CircleCompleted from 'img/circle-completed.svg';
import CircleCompletedHover from 'img/circle-completed-hover.svg';
import TaskAutomationPending from 'img/task-automation-pending.svg';
import TaskAutomationComplete from 'img/task-automation-complete.svg';

const SmartflowSidebar = ({
  isDockProUser,
  isCurrentUserEditor,
  toolkitActions,
  onAutoAlignClick,
  isDelayPopoverOpen,
  delayPeriodOptionReference,
  TaskLinkDelayForm,
  closeDelayPopover,
  handleDelayForSubmit,
  Hotkeys,
}) => {
  const [expandedCategories, setExpandedCategories] = React.useState({
    basic: true,
    communication: true,
    agents: true,
  });

  const [expandedSubCategories, setExpandedSubCategories] = React.useState({
    'communication-communication': true,
    'communication-ehr': true,
    'communication-other': true,
  });

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleSubCategory = (subCategoryId) => {
    setExpandedSubCategories(prev => ({
      ...prev,
      [subCategoryId]: !prev[subCategoryId]
    }));
  };

  const basicElements = [
    {
      id: NodeType.NEW_STANDARD,
      title: 'Task',
      description: 'Create and assign a new task',
      icon: () => <img src={CircleCompleted} alt="Task" style={{ width: 18, height: 18 }} />,
      iconClass: 'task',
      category: 'basic',
    },
    {
      id: NodeType.NEW_AUTOMATION,
      title: 'Automation Task',
      description: 'Automated task execution',
      icon: () => <AutomationTaskIcon />,
      iconClass: 'automation',
      category: 'basic',
      requiresDockPro: true,
    },
    {
      id: NodeType.NEW_DECISION,
      title: 'Decision Tree',
      description: 'Branch workflow based on conditions',
      icon: () => <DecisionIcon fontSize="small" />,
      iconClass: 'decision',
      category: 'basic',
    },
    {
      id: NodeType.NEW_WORKFLOW_LINK,
      title: 'Workflow',
      description: 'Execute sub-workflows',
      icon: () => <WorkflowLinkIcon size={18} />,
      iconClass: 'workflow',
      category: 'basic',
    },
  ];

  const communicationSubCategories = {
    communication: {
      id: 'communication-communication',
      title: 'Communication',
      elements: [
        {
          id: NodeType.NEW_EMAIL,
          title: 'Email',
          description: 'Send email notifications',
          icon: () => <EmailIcon fontSize="small" />,
          iconClass: 'email',
          category: 'communication',
          subCategory: 'communication',
        },
        {
          id: NodeType.NEW_SEND_SMS,
          title: 'Send SMS',
          description: 'Send SMS messages',
          icon: () => <SmsIcon fontSize="small" />,
          iconClass: 'sms',
          category: 'communication',
          subCategory: 'communication',
        },
      ]
    },
    ehr: {
      id: 'communication-ehr',
      title: 'EHR Update',
      elements: [
        {
          id: NodeType.NEW_CREATE_PATIENT,
          title: 'Create Patient',
          description: 'Create a new patient record',
          icon: () => <PersonAddIcon fontSize="small" />,
          iconClass: 'patient',
          category: 'communication',
          subCategory: 'ehr',
        },
        {
          id: NodeType.NEW_CREATE_APPOINTMENT,
          title: 'Create Appointment',
          description: 'Schedule a new appointment',
          icon: () => <EventAvailableIcon fontSize="small" />,
          iconClass: 'appointment',
          category: 'communication',
          subCategory: 'ehr',
        },
        {
          id: NodeType.NEW_UPDATE_APPOINTMENT,
          title: 'Update Appointment',
          description: 'Modify existing appointment',
          icon: () => <EventAvailableIcon fontSize="small" />,
          iconClass: 'appointment',
          category: 'communication',
          subCategory: 'ehr',
        },
        {
          id: NodeType.NEW_CREATE_NOTE,
          title: 'Create Note',
          description: 'Add clinical notes',
          icon: () => <NoteAddIcon fontSize="small" />,
          iconClass: 'note',
          category: 'communication',
          subCategory: 'ehr',
        },
      ]
    },
    other: {
      id: 'communication-other',
      title: 'Other',
      elements: [
        {
          id: NodeType.NEW_CALL_WEBHOOK,
          title: 'Call Webhook',
          description: 'Send HTTP requests to external APIs',
          icon: () => <CallIcon fontSize="small" />,
          iconClass: 'webhook',
          category: 'communication',
          subCategory: 'other',
        },
        {
          id: NodeType.NEW_CALL_API,
          title: 'Call API',
          description: 'Make API calls to external services',
          icon: () => <WebhookIcon fontSize="small" />,
          iconClass: 'api',
          category: 'communication',
          subCategory: 'other',
        },
      ]
    }
  };

  const agentElements = [
    {
      id: 'NEW_AI_ANALYZER',
      title: 'AI Analyzer',
      description: 'Analyze data using artificial intelligence',
      icon: () => <AIIcon fontSize="small" />,
      iconClass: 'ai',
      category: 'agents',
    },
    {
      id: 'NEW_AI_ASSISTANT',
      title: 'AI Assistant',
      description: 'Intelligent assistant for task automation',
      icon: () => <AIAssistantIcon fontSize="small" />,
      iconClass: 'ai-assistant',
      category: 'agents',
    },
  ];

  const getElementsForCategory = (category) => {
    switch (category) {
      case 'basic':
        return basicElements.filter(
          (element) => !element.requiresDockPro || isDockProUser,
        );
      case 'communication':
        // Return all elements from all communication sub-categories
        return Object.values(communicationSubCategories).flatMap(subCat => subCat.elements);
      case 'agents':
        return agentElements;
      default:
        return [];
    }
  };

  const getSubCategoryElements = (subCategoryKey) => {
    return communicationSubCategories[subCategoryKey]?.elements || [];
  };

  const handleElementClick = (elementId) => {
    const action = toolkitActions.find((a) => a.id === elementId);
    if (action && action.onClick) {
      action.onClick();
    }
  };

  const handleElementDragStart = (event, elementId) => {
    event.dataTransfer.setData('application/reactflow', elementId);
    event.dataTransfer.effectAllowed = 'move';
  };

  const categories = [
    {
      id: 'basic',
      title: 'Basic Elements',
      description: 'Core workflow building blocks',
    },
    {
      id: 'communication',
      title: 'Automations',
      description: 'External integrations and messaging',
    },
    {
      id: 'agents',
      title: 'AI Agents',
      description: 'Intelligent automation assistants',
    },
  ];

  const utilityActions = toolkitActions.filter((action) =>
    ['DEPENDENCY', 'TIME_TILL_TASK', 'ADD_BRANCH'].includes(action.id),
  );

  const getElementsWithQuickActions = (category) => {
    const elements = getElementsForCategory(category);
    if (category === 'basic' && utilityActions.length > 0) {
      return [
        ...elements,
        ...utilityActions.map((action) => ({
          id: action.id,
          title: action.label,
          description:
            action.id === 'DEPENDENCY'
              ? 'Make selected tasks dependent'
              : action.id === 'TIME_TILL_TASK'
              ? 'Add time delay to tasks'
              : action.id === 'ADD_BRANCH'
              ? 'Add decision branch'
              : action.label,
          icon: action.icon,
          iconClass: 'utility',
          category: 'basic',
          isAction: true,
          onClick: action.onClick,
          ref: action.ref,
        })),
      ];
    }
    return elements;
  };

  return (
    <ElementsSidebar>
      <SidebarHeader>
        <SidebarTitle>SmartFlow Toolkit</SidebarTitle>
        <SidebarSubtitle>Drag elements to build your workflow</SidebarSubtitle>
      </SidebarHeader>

      <SidebarContent>
        {categories.map((category) => (
          <CategorySection key={category.id}>
            <CategoryTitle 
              onClick={() => toggleCategory(category.id)}
              style={{ 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                userSelect: 'none'
              }}
            >
              {category.title}
              {expandedCategories[category.id] ? 
                <ExpandMoreIcon fontSize="small" /> : 
                <ChevronRightIcon fontSize="small" />
              }
            </CategoryTitle>

            {expandedCategories[category.id] && (
              <>
                {category.id === 'communication' ? (
                  // Render sub-categories for communication
                  Object.entries(communicationSubCategories).map(([subKey, subCategory]) => (
                    <div key={subCategory.id} style={{ marginLeft: '16px' }}>
                      <CategoryTitle 
                        onClick={() => toggleSubCategory(subCategory.id)}
                        style={{ 
                          cursor: 'pointer', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          userSelect: 'none',
                          fontSize: '14px',
                          fontWeight: 'normal',
                          marginTop: '8px',
                          marginBottom: '4px'
                        }}
                      >
                        {subCategory.title}
                        {expandedSubCategories[subCategory.id] ? 
                          <ExpandMoreIcon fontSize="small" /> : 
                          <ChevronRightIcon fontSize="small" />
                        }
                      </CategoryTitle>
                      
                      {expandedSubCategories[subCategory.id] && (
                        <>
                          {subCategory.elements.map((element) => (
                            <ElementButton
                              key={element.id}
                              onClick={() => handleElementClick(element.id)}
                              onDragStart={(event) =>
                                handleElementDragStart(event, element.id)
                              }
                              draggable={isCurrentUserEditor}
                              disabled={!isCurrentUserEditor}
                              style={{ marginLeft: '8px' }}
                            >
                              <ElementIconBackground className={element.iconClass}>
                                <element.icon />
                              </ElementIconBackground>

                              <ElementInfo>
                                <ElementTitle>{element.title}</ElementTitle>
                                <ElementDescription>{element.description}</ElementDescription>
                              </ElementInfo>
                            </ElementButton>
                          ))}
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  // Render normal elements for other categories
                  getElementsWithQuickActions(category.id).map((element) => (
                    <ElementButton
                      key={element.id}
                      onClick={() =>
                        element.isAction
                          ? element.onClick()
                          : handleElementClick(element.id)
                      }
                      onDragStart={(event) =>
                        !element.isAction && handleElementDragStart(event, element.id)
                      }
                      draggable={isCurrentUserEditor && !element.isAction}
                      disabled={!isCurrentUserEditor}
                      ref={element.ref}
                    >
                      <ElementIconBackground className={element.iconClass}>
                        <element.icon />
                      </ElementIconBackground>

                      <ElementInfo>
                        <ElementTitle>{element.title}</ElementTitle>
                        <ElementDescription>{element.description}</ElementDescription>
                      </ElementInfo>
                    </ElementButton>
                  ))
                )}
              </>
            )}
          </CategorySection>
        ))}
      </SidebarContent>

      {isCurrentUserEditor && (
        <UtilitySection>
          <AutoAlignButton onClick={onAutoAlignClick}>
            <AutoAlignIcon fontSize="small" />
            Auto Align Layout
          </AutoAlignButton>

          <div style={{ marginTop: '16px' }}>
            <Hotkeys />
          </div>
        </UtilitySection>
      )}

      {isDelayPopoverOpen && (
        <Popper
          anchorEl={delayPeriodOptionReference.current}
          placement="right"
          open
          style={{ zIndex: 10 }}
        >
          <ClickAwayListener onClickAway={closeDelayPopover}>
            <Paper>
              <TaskLinkDelayForm
                onSubmit={handleDelayForSubmit}
                onClose={closeDelayPopover}
              />
            </Paper>
          </ClickAwayListener>
        </Popper>
      )}
    </ElementsSidebar>
  );
};

export default SmartflowSidebar;
