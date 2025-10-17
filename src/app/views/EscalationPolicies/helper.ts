import { EscalationPolicy } from "@/app/types/escalationPolicy";
import { TaskPriority } from "@/app/helpers/task-helpers";

export const EscalationActionType = {
  AddAssignee: 'AddAssignee',
  CreateTask: 'CreateTask',
  // UpdateTask: 'UpdateTask',
  // SendEmail: 'SendEmail',
  // SendSlack: 'SendSlack',
  // ScheduleEscalation: 'ScheduleEscalation',
} as const;

export const timestampFieldOptions = [
  { value: 'createdDate', label: 'Task Created Date' },
  { value: 'dueDate', label: 'Task Due Date' },
  { value: 'updatedDate', label: 'Task Updated Date' },
  { value: 'startDate', label: 'Task Start Date' },
];

export const timeUnitOptions = [
  { value: 'minutes', label: 'Minutes' },
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
];

export const delayOptions = [
  { value: '15m', label: '15 minutes' },
  { value: '30m', label: '30 minutes' },
  { value: '1h', label: '1 hour' },
  { value: '2h', label: '2 hours' },
  { value: '4h', label: '4 hours' },
  { value: '8h', label: '8 hours' },
  { value: '12h', label: '12 hours' },
  { value: '1d', label: '1 day' },
  { value: '2d', label: '2 days' },
  { value: '3d', label: '3 days' },
  { value: '1w', label: '1 week' },
  { value: '2w', label: '2 weeks' },
];

export const scopeOptions = [
  { value: 'ORGANIZATION', label: 'Organization' },
  { value: 'LIST', label: 'List' },
  { value: 'WORKFLOW', label: 'Workflow' },
  // { value: 'GROUP', label: 'Group' },
  // { value: 'TASK', label: 'Task' }
];

export const actionTypeOptions = [
  { value: EscalationActionType.AddAssignee, label: 'Add Assignee' },
  { value: EscalationActionType.CreateTask, label: 'Create Task' },
  // { value: EscalationActionType.UpdateTask, label: 'Update Task' },
  // { value: EscalationActionType.SendEmail, label: 'Send Email' },
  // { value: EscalationActionType.SendSlack, label: 'Send Slack' },
  // { value: EscalationActionType.ScheduleEscalation, label: 'Schedule Escalation' }
];

export const priorityOptions = [
  { value: TaskPriority.NONE, label: 'None' },
  { value: TaskPriority.HIGH, label: 'High' },
];

export const formatFilterDetails = (scopeFilter: any, references?: EscalationPolicy['references']) => {
  if (!scopeFilter) {
    return ['No filters applied'];
  }

  const details: string[] = [];

  const getNames = (identifiers: string[], refArray?: Array<{ identifier: string; name: string }>) => {
    if (!refArray || refArray.length === 0) {
      return identifiers.map(id => id.substring(0, 8) + '...');
    }
    return identifiers
      .map(id => refArray.find(ref => ref.identifier === id)?.name || id.substring(0, 8) + '...')
      .filter(Boolean);
  };

  if (scopeFilter?.assignee?.in?.user?.length > 0) {
    const userNames = getNames(scopeFilter.assignee.in.user, references?.users);
    details.push(`<strong>Assigned Users:</strong> ${userNames.join(', ')}`);
  }

  if (scopeFilter?.assignee?.in?.group?.length > 0) {
    const groupNames = getNames(scopeFilter.assignee.in.group, references?.groups);
    details.push(`<strong>Assigned User Groups:</strong> ${groupNames.join(', ')}`);
  }

  if (scopeFilter?.patients?.in?.length > 0) {
    const patientNames = getNames(scopeFilter.patients.in, references?.patients);
    details.push(`<strong>Assigned Patients:</strong> ${patientNames.join(', ')}`);
  }

  if (scopeFilter?.patientLabels?.in?.length > 0) {
    details.push(`<strong>Patient Labels:</strong> ${scopeFilter.patientLabels.in.join(', ')}`);
  }

  if (scopeFilter?.taskLabels?.in?.length > 0) {
    details.push(`<strong>Task Labels:</strong> ${scopeFilter.taskLabels.in.join(', ')}`);
  }

  if (scopeFilter?.status?.in?.length > 0) {
    const statusNames = getNames(scopeFilter.status.in, references?.statuses || references?.workflows);
    details.push(`<strong>Task Status:</strong> ${statusNames.join(', ')}`);
  }

  // Lists and Workflows are now displayed separately in the scope section, not in filters
  // if (scopeFilter?.lists?.in?.length > 0) {
  //   const listNames = getNames(scopeFilter.lists.in, references?.lists);
  //   details.push(`Lists: ${listNames.join(', ')}`);
  // }

  // if (scopeFilter?.workflows?.in?.length > 0) {
  //   const workflowNames = getNames(scopeFilter.workflows.in, references?.workflows);
  //   details.push(`Workflows: ${workflowNames.join(', ')}`);
  // }

  return details.length > 0 ? details : ['No filters applied'];
};

export const formatTriggerDetails = (trigger: any) => {
  if (!trigger) return 'No trigger configured';

  const timestampField = timestampFieldOptions.find(
    (opt: any) => opt.value === trigger.timestampField,
  )?.label || trigger.timestampField;
  
  let timeDisplay = '';
  if (trigger.overdueValue && trigger.overdueUnit) {
    timeDisplay = `${trigger.overdueValue} ${trigger.overdueUnit}`;
  }

  return `${timestampField} + ${timeDisplay}`;
};

export interface ActionDetail {
  main: string;
  subItems?: string[];
}

export const formatActionDetails = (actions: any[], references?: EscalationPolicy['references']): ActionDetail[] => {
  if (!actions || !Array.isArray(actions)) {
    return [{ main: 'No actions configured' }];
  }

  const getNames = (identifiers: string[], refArray?: Array<{ identifier: string; name: string }>) => {
    if (!identifiers || identifiers.length === 0) return [];
    if (!refArray || refArray.length === 0) {
      return identifiers;
    }
    return identifiers
      .map(id => refArray.find(ref => ref.identifier === id)?.name || id)
      .filter(Boolean);
  };

  return actions.map((action) => {
    if (!action || !action.type) {
      return { main: 'Unknown action' };
    }

    const actionType = actionTypeOptions.find((opt: any) => opt.value === action.type)?.label || action.type;
    const result: ActionDetail = { main: actionType, subItems: [] };

    switch (action.type) {
      case EscalationActionType.AddAssignee:
        const assigneeUsers = action.params?.addAssigneeUsers?.length > 0 
          ? getNames(action.params.addAssigneeUsers, references?.users)
          : [];
        const assigneeGroups = action.params?.addAssigneeGroups?.length > 0
          ? getNames(action.params.addAssigneeGroups, references?.groups)
          : [];
        const assigneeIds = action.params?.addAssigneeIdentifiers?.length > 0
          ? getNames(action.params.addAssigneeIdentifiers, references?.users)
          : [];
        
        const allAssignees = [...assigneeUsers, ...assigneeGroups, ...assigneeIds];
        if (allAssignees.length > 0) {
          result.subItems!.push(`<strong>Assignees:</strong> ${allAssignees.join(', ')}`);
        }
        if (action.params?.comment) {
          result.subItems!.push(`<strong>Comment:</strong> "${action.params.comment}"`);
        }
        break;
        
      // case EscalationActionType.SendEmail:
      //   if (action.params?.subject) {
      //     result.subItems!.push(`<strong>Subject:</strong> "${action.params.subject}"`);
      //   }
      //   if (action.params?.recipients?.length > 0) {
      //     result.subItems!.push(`<strong>Recipients:</strong> ${action.params.recipients.join(', ')}`);
      //   }
      //   if (action.params?.body) {
      //     result.subItems!.push(`<strong>Body:</strong> ${action.params.body}`);
      //   }
      //   break;
        
      // case EscalationActionType.SendSlack:
      //   if (action.params?.channel) {
      //     result.subItems!.push(`<strong>Channel:</strong> ${action.params.channel}`);
      //   }
      //   if (action.params?.message) {
      //     result.subItems!.push(`<strong>Message:</strong> ${action.params.message}`);
      //   }
      //   break;
        
      case EscalationActionType.CreateTask:
        if (action.params?.taskList) {
          const listName = references?.lists?.find((list: any) => list.identifier === action.params.taskList)?.name || action.params.taskList;
          result.subItems!.push(`<strong>Task List:</strong> ${listName}`);
        }
        if (action.params?.taskGroup) {
          const taskGroups = (references as any)?.taskGroups;
          const groupName = taskGroups?.find((group: any) => group.identifier === action.params.taskGroup)?.name || action.params.taskGroup;
          result.subItems!.push(`<strong>Group:</strong> ${groupName}`);
        }
        if (action.params?.title) {
          result.subItems!.push(`<strong>Description:</strong> "${action.params.title}"`);
        }
        if (action.params?.assignee?.length > 0) {
          const assigneeNames = getNames(action.params.assignee, references?.users);
          if (assigneeNames.length > 0) {
            result.subItems!.push(`<strong>Assignees:</strong> ${assigneeNames.join(', ')}`);
          }
        }
        if (action.params?.description) {
          result.subItems!.push(`<strong>Description:</strong> ${action.params.description}`);
        }
        if (action.params?.dueDate) {
          result.subItems!.push(`<strong>Due Date:</strong> ${action.params.dueDate}`);
        }
        if (action.params?.priority) {
          result.subItems!.push(`<strong>Priority:</strong> ${action.params.priority}`);
        }
        break;
        
      // case EscalationActionType.UpdateTask:
      //   if (action.params?.priority) {
      //     result.subItems!.push(`<strong>Priority:</strong> ${action.params.priority}`);
      //   }
      //   if (action.params?.status) {
      //     result.subItems!.push(`<strong>Status:</strong> ${action.params.status}`);
      //   }
      //   if (action.params?.assignee) {
      //     result.subItems!.push(`<strong>Assignee:</strong> ${action.params.assignee}`);
      //   }
      //   break;
        
      // case EscalationActionType.ScheduleEscalation:
      //   if (action.params?.delay) {
      //     result.subItems!.push(`<strong>Delay:</strong> ${action.params.delay}`);
      //   }
      //   if (action.params?.escalateTo) {
      //     result.subItems!.push(`<strong>Escalate To:</strong> ${action.params.escalateTo}`);
      //   }
      //   break;
    }

    return result;
  });
};
