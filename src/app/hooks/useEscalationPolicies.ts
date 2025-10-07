import { useState, useEffect, useCallback } from 'react';
import {
  getAllEscalationPolicies,
  createEscalationPolicy,
  updateEscalationPolicy,
  deleteEscalationPolicy,
} from '@/app/api/escalation-policy-api';
import { getTaskListForUser } from '@/app/api/task-list-api';
import {
  getOrganizationUsersAndUserGroups,
  getOrganizationStatuses,
} from '@/app/api/organization-api';
import { getTemplates } from '@/app/api/task-template-api';
import { EscalationPolicy } from '@/app/types/escalationPolicy';

export interface TaskList {
  taskListIdentifier: string;
  listName: string;
  listDescription?: string;
  color?: string;
  numberOfTasks?: number;
  status?: string;
  numberOfHighPriorityTasks?: number;
  hasUpdatesForMember?: boolean;
  listType?: string;
  active?: boolean;
  notifications?: boolean;
  role?: string;
  archived?: boolean;
  restrictCustomization?: boolean;
  discoveryEnabled?: boolean;
}

export interface UserOrGroup {
  identifier: string;
  userName: string;
  itemType: 'USER' | 'GROUP';
}

export interface SelectOption {
  id: string;
  name: string;
}

export interface EscalationPoliciesState {
  policies: EscalationPolicy[];
  userOptions: SelectOption[];
  groupOptions: SelectOption[];
  listOptions: SelectOption[];
  workflowOptions: SelectOption[];
  statusOptions: SelectOption[];
  loading: boolean;
}

export interface EscalationPoliciesActions {
  loadPolicies: () => Promise<void>;
  loadTaskLists: (workspaceIdentifier?: string) => Promise<void>;
  loadUsersAndGroups: () => Promise<void>;
  loadWorkflows: () => Promise<void>;
  loadStatuses: () => Promise<void>;
  createPolicy: (policyData: any) => Promise<EscalationPolicy>;
  updatePolicy: (
    identifier: string,
    policyData: Partial<any>,
  ) => Promise<EscalationPolicy>;
  deletePolicy: (identifier: string) => Promise<void>;
}

export const useEscalationPolicies = (
  workspaceIdentifier?: string,
): EscalationPoliciesState & EscalationPoliciesActions => {
  const [policies, setPolicies] = useState<EscalationPolicy[]>([]);
  const [userOptions, setUserOptions] = useState<SelectOption[]>([]);
  const [groupOptions, setGroupOptions] = useState<SelectOption[]>([]);
  const [listOptions, setListOptions] = useState<SelectOption[]>([]);
  const [workflowOptions, setWorkflowOptions] = useState<SelectOption[]>([]);
  const [statusOptions, setStatusOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPolicies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllEscalationPolicies();
      setPolicies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTaskLists = useCallback(
    async (workspaceId?: string) => {
      try {
        const data = await getTaskListForUser(
          workspaceId || workspaceIdentifier,
        );

        const formattedLists = (data || [])
          .filter((list: TaskList) => list.active && list.status === 'ACCEPTED')
          .map((list: TaskList) => ({
            id: list.taskListIdentifier,
            name: list.listName,
          }));

        setListOptions(formattedLists);
      } catch (err) {
        console.error(err);
      }
    },
    [workspaceIdentifier],
  );

  const loadUsersAndGroups = useCallback(async () => {
    try {
      const data = await getOrganizationUsersAndUserGroups();

      const formattedUsers = (data || [])
        .filter((item: any) => item.itemType === 'USER')
        .map((item: any) => ({
          id: item.identifier,
          name: item.userName,
        }));

      const formattedGroups = (data || [])
        .filter((item: any) => item.itemType === 'GROUP')
        .map((item: any) => ({
          id: item.identifier,
          name: item.userName,
        }));

      setUserOptions(formattedUsers);
      setGroupOptions(formattedGroups);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadWorkflows = useCallback(async () => {
    try {
      const data = await getTemplates(true);

      const formattedWorkflows = (data || [])
        .filter((item: any) => item.templateType !== 'FOLDER')
        .map((item: any) => ({
          id: item.identifier,
          name: item.name,
        }));

      setWorkflowOptions(formattedWorkflows);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadStatuses = useCallback(async () => {
    try {
      const data = await getOrganizationStatuses();

      const formattedStatuses = (data || []).map((item: any) => ({
        id: item.identifier,
        name: item.name,
      }));

      setStatusOptions(formattedStatuses);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const createPolicy = useCallback(
    async (policyData: any): Promise<EscalationPolicy> => {
      try {
        const newPolicy = await createEscalationPolicy(policyData);
        await loadPolicies();
        return newPolicy;
      } catch (err) {
        throw err;
      }
    },
    [loadPolicies],
  );

  const updatePolicy = useCallback(
    async (
      identifier: string,
      policyData: Partial<any>,
    ): Promise<EscalationPolicy> => {
      try {
        const updatedPolicy = await updateEscalationPolicy(
          identifier,
          policyData,
        );
        await loadPolicies();
        return updatedPolicy;
      } catch (err) {
        throw err;
      }
    },
    [loadPolicies],
  );

  const deletePolicy = useCallback(
    async (identifier: string): Promise<void> => {
      try {
        await deleteEscalationPolicy(identifier);
        await loadPolicies();
      } catch (err) {
        throw err;
      }
    },
    [loadPolicies],
  );

  useEffect(() => {
    loadPolicies();
    loadTaskLists();
    loadUsersAndGroups();
    loadWorkflows();
    loadStatuses();
  }, [
    loadPolicies,
    loadTaskLists,
    loadUsersAndGroups,
    loadWorkflows,
    loadStatuses,
  ]);

  return {
    policies,
    userOptions,
    groupOptions,
    listOptions,
    workflowOptions,
    statusOptions,
    loading,
    loadPolicies,
    loadTaskLists,
    loadUsersAndGroups,
    loadWorkflows,
    loadStatuses,
    createPolicy,
    updatePolicy,
    deletePolicy,
  };
};

export default useEscalationPolicies;
