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

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const basicElements = [
    {
      id: NodeType.NEW_STANDARD,
      title: 'Task',
      description: 'Create and assign a new task',
      icon: () => <TaskElementIcon />,
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

  const communicationElements = [
    {
      id: NodeType.NEW_EMAIL,
      title: 'Email',
      description: 'Send email notifications',
      icon: () => <EmailIcon fontSize="small" />,
      iconClass: 'email',
      category: 'communication',
    },
    {
      id: 'NEW_WEBHOOK',
      title: 'Webhook',
      description: 'Send HTTP requests to external APIs',
      icon: () => <WebhookIcon fontSize="small" />,
      iconClass: 'webhook',
      category: 'communication',
    },
  ];

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
        return communicationElements;
      case 'agents':
        return agentElements;
      default:
        return [];
    }
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
      title: 'Automation',
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
                {getElementsWithQuickActions(category.id).map((element) => (
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
                ))}
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
