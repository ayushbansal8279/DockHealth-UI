import { EscalationPolicy } from "@/app/types/escalationPolicy";


export const timestampFieldOptions = [
  { value: 'createdDate', label: 'Task Created Date' },
  { value: 'assignedDate', label: 'Task Assigned Date' },
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
  { value: 'GROUP', label: 'Group' },
  { value: 'WORKFLOW', label: 'Workflow' },
  { value: 'TASK', label: 'Task' }
];

export const actionTypeOptions = [
  { value: 'AddAssignee', label: 'Add Assignee' },
  { value: 'CreateTask', label: 'Create Task' },
  { value: 'UpdateTask', label: 'Update Task' },
  { value: 'SendEmail', label: 'Send Email' },
  { value: 'SendSlack', label: 'Send Slack' },
  { value: 'ScheduleEscalation', label: 'Schedule Escalation' }
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
    details.push(`Users: ${userNames.join(', ')}`);
  }

  if (scopeFilter?.assignee?.in?.group?.length > 0) {
    const groupNames = getNames(scopeFilter.assignee.in.group, references?.groups);
    details.push(`User Groups: ${groupNames.join(', ')}`);
  }

  if (scopeFilter?.patients?.in?.length > 0) {
    const patientNames = getNames(scopeFilter.patients.in, references?.patients);
    details.push(`Patients: ${patientNames.join(', ')}`);
  }

  if (scopeFilter?.patientLabels?.in?.length > 0) {
    details.push(`Patient Labels: ${scopeFilter.patientLabels.in.join(', ')}`);
  }

  if (scopeFilter?.taskLabels?.in?.length > 0) {
    details.push(`Task Labels: ${scopeFilter.taskLabels.in.join(', ')}`);
  }

  if (scopeFilter?.status?.in?.length > 0) {
    const statusNames = getNames(scopeFilter.status.in, references?.statuses || references?.workflows);
    details.push(`Task Status: ${statusNames.join(', ')}`);
  }

  if (scopeFilter?.lists?.in?.length > 0) {
    const listNames = getNames(scopeFilter.lists.in, references?.lists);
    details.push(`Lists: ${listNames.join(', ')}`);
  }

  if (scopeFilter?.workflows?.in?.length > 0) {
    const workflowNames = getNames(scopeFilter.workflows.in, references?.workflows);
    details.push(`Workflows: ${workflowNames.join(', ')}`);
  }

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
      case 'AddAssignee':
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
          result.subItems!.push(`Assignees: ${allAssignees.join(', ')}`);
        }
        if (action.params?.comment) {
          result.subItems!.push(`Comment: "${action.params.comment}"`);
        }
        break;
        
      case 'SendEmail':
        if (action.params?.subject) {
          result.subItems!.push(`Subject: "${action.params.subject}"`);
        }
        if (action.params?.recipients?.length > 0) {
          result.subItems!.push(`Recipients: ${action.params.recipients.join(', ')}`);
        }
        if (action.params?.body) {
          result.subItems!.push(`Body: ${action.params.body}`);
        }
        break;
        
      case 'SendSlack':
        if (action.params?.channel) {
          result.subItems!.push(`Channel: ${action.params.channel}`);
        }
        if (action.params?.message) {
          result.subItems!.push(`Message: ${action.params.message}`);
        }
        break;
        
      case 'CreateTask':
        if (action.params?.title) {
          result.subItems!.push(`Title: "${action.params.title}"`);
        }
        if (action.params?.assignee?.length > 0) {
          const assigneeNames = getNames(action.params.assignee, references?.users);
          if (assigneeNames.length > 0) {
            result.subItems!.push(`Assignees: ${assigneeNames.join(', ')}`);
          }
        }
        if (action.params?.description) {
          result.subItems!.push(`Description: ${action.params.description}`);
        }
        if (action.params?.dueDate) {
          result.subItems!.push(`Due Date: ${action.params.dueDate}`);
        }
        if (action.params?.priority) {
          result.subItems!.push(`Priority: ${action.params.priority}`);
        }
        break;
        
      case 'UpdateTask':
        if (action.params?.priority) {
          result.subItems!.push(`Priority: ${action.params.priority}`);
        }
        if (action.params?.status) {
          result.subItems!.push(`Status: ${action.params.status}`);
        }
        if (action.params?.assignee) {
          result.subItems!.push(`Assignee: ${action.params.assignee}`);
        }
        break;
        
      case 'ScheduleEscalation':
        if (action.params?.delay) {
          result.subItems!.push(`Delay: ${action.params.delay}`);
        }
        if (action.params?.escalateTo) {
          result.subItems!.push(`Escalate To: ${action.params.escalateTo}`);
        }
        break;
    }

    return result;
  });
};
