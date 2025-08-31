/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useRef, useEffect } from 'react';
import 'reactflow/dist/style.css';
import { useBoolean } from 'hooks/useBoolean';
import SubtaskIcon from 'img/SubtaskIcon';
import { Box, Fab, IconButton, Typography } from '@mui/material';
import {
  AccountTree as DecisionIcon,
  Email as EmailIcon,
  Webhook as WebhookIcon,
  Psychology as AIIcon,
  SmartToy as AIAssistantIcon,
  Description as DocumentParsingIcon,
  VerifiedUser as EligibilityIcon,
  FolderOpen as MedicalRecordIcon,
  FindInPage as MissingRecordsIcon,
  RecordVoiceOver as VoiceIcon,
  AutoFixHigh as AutoAlignIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Sms as SmsIcon,
  PersonAdd as PersonAddIcon,
  EventAvailable as EventAvailableIcon,
  NoteAdd as NoteAddIcon,
  Call as CallIcon,
} from '@mui/icons-material';
import BoltIcon from '@mui/icons-material/Bolt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { isUserGroup } from 'helpers/user-helper';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import { openModal, closeModal } from 'modal/actions';
import VoiceAgentNodeDrawer from '../NodeDrawers/VoiceAgentNodeDrawer';
import MissingRecordsAgentNodeDrawer from '../NodeDrawers/MissingRecordsAgentNodeDrawer';
import { openAgentDrawer, closeAgentDrawer } from 'actions/agent-drawer-actions';
import {
  deleteTask,
  partialUpdateTask,
  storeAsCurrentTask,
} from 'actions/task-actions';
import { openDrawer } from 'actions/task-drawer-actions';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import AdditionalMembersCounter from 'components/user/AdditionalMembersCounter/AdditionalMembersCounter';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import { NodeType } from 'helpers/smart-flow-builder-helpers';
import { createMentionsFromTokenizedDescription } from 'components/common/RichTextEditor/CreateMentions';
import TaskNodeWrapper from '../TaskNodeWrapper/TaskNodeWrapper';
import TaskNodeHandles from '../TaskNodeHandles/TaskNodeHandles';
import {
  TaskInfoWrapper,
  TaskDescription,
  TaskDescriptionInput,
  SubtasksLabel,
  DecisionTaskIconWrapper,
  TaskDescriptionWrapper,
  TaskDescriptionInputWrapper,
} from './styled';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import BaseNode from '../BaseNode/BaseNode';
import DecisionTaskElementIcon from 'img/template/decision-task-icon';
import TaskElementIcon from '@/app/img/task-icon';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';

const TaskNode = React.memo(({ data, isConnectable, selected, type }) => {
  const { task } = data || {};
  const {
    taskIdentifier,
    description,
    labels,
    updatedLabel,
    attachments,
    updatedAttachment,
    comments,
    updatedComment,
    subtasks,
    assignedToUsers,
    tokenizedDescription,
    taskMentions,
  } = task || {};
  const descriptionInputReference = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [editing, setEditing, unsetEditing] = useBoolean(false);
  const dispatch = useDispatch();
  const titles = {
    [NodeType.DECISION]: 'Decision Task',
    [NodeType.STANDARD]: 'Task',
  };

  const subType =
    type === NodeType.STANDARD && description.includes('[System]')
      ? 'AUTOMATION'
      : type === NodeType.STANDARD && description.includes('[Agent]')
      ? 'AGENT'
      : type === NodeType.DECISION
      ? 'DECISION'
      : 'STANDARD';

  useEffect(() => {
    if (editing) {
      setInputValue(description);
      descriptionInputReference.current.focus();
    } else {
      setInputValue('');
    }
  }, [description, editing]);

  const handleDelete = () => {
    const modalProps = {
      isSubtask: !!task.parentTaskIdentifier,
      confirm: () => {
        dispatch(deleteTask(task));
        dispatch(closeModal());
      },
    };

    dispatch(openModal('DeleteTaskConfirmation', modalProps));
  };

  const handleEdit = () => {
    dispatch(storeAsCurrentTask(task));
    dispatch(openDrawer());
  };

  const openAgentSpecificDrawer = () => {
    // Check if this is an agent task and determine the specific agent type
    if (subType === 'AGENT') {
      // Extract agent type from description or task data
      const agentType = determineAgentType(description);
      
      switch (agentType) {
        case 'voice':
          // Open Voice Agent specific drawer
          openVoiceAgentDrawer();
          break;
        case 'missing-records':
          // Open Missing Records Agent specific drawer
          openMissingRecordsAgentDrawer();
          break;
        case 'document-parsing':
          // Open Document Parsing Agent specific drawer
          openDocumentParsingAgentDrawer();
          break;
        case 'eligibility':
          // Open Eligibility Agent specific drawer
          openEligibilityAgentDrawer();
          break;
        case 'medical-record-gathering':
          // Open Medical Record Gathering Agent specific drawer
          openMedicalRecordGatheringAgentDrawer();
          break;
        default:
          // Fallback to standard task drawer
          dispatch(storeAsCurrentTask(task));
          dispatch(openDrawer());
          break;
      }
    } else {
      // For non-agent tasks, use the standard task drawer
      dispatch(storeAsCurrentTask(task));
      dispatch(openDrawer());
    }
  };

  const determineAgentType = (taskDescription) => {
    if (!taskDescription) return null;
    
    const description = taskDescription.toLowerCase();
    
    if (description.includes('voice') || description.includes('call')) {
      return 'voice';
    }
    if (description.includes('missing') && description.includes('record')) {
      return 'missing-records';
    }
    if (description.includes('document') && description.includes('parsing')) {
      return 'document-parsing';
    }
    if (description.includes('eligibility')) {
      return 'eligibility';
    }
    if (description.includes('medical') && description.includes('record') && description.includes('gathering')) {
      return 'medical-record-gathering';
    }
    
    return null;
  };

  const openVoiceAgentDrawer = () => {
    dispatch(openAgentDrawer('voice', task));
  };

  const openMissingRecordsAgentDrawer = () => {
    dispatch(openAgentDrawer('missing-records', task));
  };

  const openDocumentParsingAgentDrawer = () => {
    dispatch(openAgentDrawer('document-parsing', task));
  };

  const openEligibilityAgentDrawer = () => {
    dispatch(openAgentDrawer('eligibility', task));
  };

  const openMedicalRecordGatheringAgentDrawer = () => {
    dispatch(openAgentDrawer('medical-record-gathering', task));
  };

  const openTaskDrawer = (filed) => {
    dispatch(openDrawer(filed));
    dispatch(storeAsCurrentTask(task));
  };

  const handleBlur = () => {
    if (inputValue?.length > 0) {
      dispatch(
        partialUpdateTask(taskIdentifier, {
          description: inputValue,
          tokenizedDescription: inputValue,
        }),
      ).then(() => {
        unsetEditing();
      });
    }
  };

  const handleKeyDown = (event) => {
    const { key } = event;

    switch (key) {
      case 'Enter': {
        if (inputValue?.length > 0) {
          descriptionInputReference.current.blur();
        }
        break;
      }
      case 'Escape': {
        unsetEditing();
        break;
      }
      default: {
        break;
      }
    }
  };

  const memberslist = data?.task?.taskTemplate?.members || [];
  const currentUser = useSelector(userProfileSelector);
  const isCurrentMemberPermission =
    memberslist?.find(({ user }) => user.identifier === currentUser.identifier)
      ?.memberPermission === 'VIEW';

  return (
    <TaskNodeHandles
      isConnectable={isConnectable}
      isConnecting={data.draggedEdgeSourceId}
      onTargetHandleHover={data.onTargetHandleHover}
      draggedEdgeSourceId={data?.draggedEdgeSourceId}
    >
      <BaseNode
        selected={selected}
        type={type}
        subType={subType}
        onDoubleClick={setEditing}
        optionButtons={[
          <Fab
            key="delete"
            aria-label="delete"
            size="small"
            onClick={handleDelete}
          >
            <DeleteIcon fontSize="small" color="inherit" />
          </Fab>,
          <Fab 
            key="edit" 
            aria-label="edit" 
            size="small" 
            onClick={subType === 'AGENT' ? openAgentSpecificDrawer : handleEdit}
          >
            <EditIcon fontSize="small" color="inherit" />
          </Fab>,
        ]}
        headerIcon={
          <>
            {subType === 'AUTOMATION' && <BoltIcon fontSize="medium" />}
            {subType === 'AGENT' && <AIIcon />}
            {subType === 'DECISION' && <DecisionIcon fontSize="small" />}
            {subType === 'STANDARD' && <TaskElementIcon />}
          </>
        }
        headerTitle={
          subType === 'AUTOMATION'
            ? 'Automation Task'
            : subType === 'AGENT'
            ? 'Agent'
            : subType === 'DECISION'
            ? 'Decision Task'
            : titles[type] || ''
        }
        content={
          <>
            {editing ? (
              <TaskDescriptionInputWrapper>
                <TaskDescriptionInput
                  ref={descriptionInputReference}
                  value={inputValue}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  onChange={(event) => setInputValue(event.target?.value || '')}
                />
              </TaskDescriptionInputWrapper>
            ) : (
              <Tooltip
                title={tokenizedDescription}
                key={tokenizedDescription}
                placement="top"
              >
                <TaskDescriptionWrapper>
                  <TaskDescription>
                    {createMentionsFromTokenizedDescription(
                      tokenizedDescription,
                      taskMentions,
                    )}
                  </TaskDescription>
                </TaskDescriptionWrapper>
              </Tooltip>
            )}
          </>
        }
        footerContent={
          <TaskInfoWrapper>
            {!isCurrentMemberPermission && (
              <Box display="flex">
                <button
                  type="button"
                  onClick={() => openTaskDrawer(DrawerFieldEnum.COMMENT)}
                >
                  <TaskIcon
                    type="comments"
                    isActive={comments?.length > 0}
                    isNew={updatedComment}
                  />
                </button>
                <Box p={1} />
                <button
                  type="button"
                  onClick={() => openTaskDrawer(DrawerFieldEnum.LABEL)}
                >
                  <TaskIcon
                    type="labels"
                    isActive={labels?.length > 0}
                    isNew={updatedLabel}
                  />
                </button>
                <Box p={1} />
                <button
                  type="button"
                  onClick={() => openTaskDrawer(DrawerFieldEnum.ATTACHMENT)}
                >
                  <TaskIcon
                    type="attachments"
                    isActive={attachments?.length > 0}
                    isNew={updatedAttachment}
                  />
                </button>
                <Box px={1} />
                {subtasks?.length > 0 && (
                  <SubtasksLabel>
                    {subtasks.length}
                    <Box px={0.2} />
                    <SubtaskIcon color="currentColor" size={12} />
                  </SubtasksLabel>
                )}
              </Box>
            )}
            <Box
              sx={{
                display: 'flex',
              }}
            >
              <Box p={2} />
              {
                <Box sx={{ paddingRight: '10px' }}>
                  {assignedToUsers?.length === 1 &&
                    (isUserGroup(assignedToUsers[0]) ? (
                      <GroupAvatar group={assignedToUsers[0]} size={30} />
                    ) : (
                      <UserAvatar user={assignedToUsers[0]} size={30} />
                    ))}
                </Box>
              }
              {assignedToUsers?.length > 1 && (
                <AdditionalMembersCounter
                  hiddenMembers={assignedToUsers}
                  size={30}
                />
              )}
            </Box>
          </TaskInfoWrapper>
        }
      />
    </TaskNodeHandles>
  );
});

export default TaskNode;
