import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
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
  error: string | null;
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
  clearError: () => void;
}

export const useEscalationPolicies = (
  workspaceIdentifier?: string,
): EscalationPoliciesState & EscalationPoliciesActions => {
  const dispatch = useDispatch();

  const [policies, setPolicies] = useState<EscalationPolicy[]>([]);
  const [userOptions, setUserOptions] = useState<SelectOption[]>([]);
  const [groupOptions, setGroupOptions] = useState<SelectOption[]>([]);
  const [listOptions, setListOptions] = useState<SelectOption[]>([]);
  const [workflowOptions, setWorkflowOptions] = useState<SelectOption[]>([]);
  const [statusOptions, setStatusOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPolicies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllEscalationPolicies();
      setPolicies(data);
    } catch (err) {
      const errorMessage = 'Failed to load escalation policies';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTaskLists = useCallback(
    async (workspaceId?: string) => {
      try {
        setError(null);
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
        const errorMessage = 'Failed to load task lists';
        setError(errorMessage);
        console.error(err);
      }
    },
    [workspaceIdentifier],
  );

  const loadUsersAndGroups = useCallback(async () => {
    try {
      setError(null);
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
      const errorMessage = 'Failed to load users and groups';
      setError(errorMessage);
      console.error(err);
    }
  }, []);

  const loadWorkflows = useCallback(async () => {
    try {
      setError(null);
      const data = await getTemplates(true);

      const formattedWorkflows = (data || [])
        .filter((item: any) => item.templateType !== 'FOLDER')
        .map((item: any) => ({
          id: item.identifier,
          name: item.name,
        }));

      setWorkflowOptions(formattedWorkflows);
    } catch (err) {
      const errorMessage = 'Failed to load workflows';
      setError(errorMessage);
      console.error(err);
    }
  }, []);

  const loadStatuses = useCallback(async () => {
    try {
      setError(null);
      const data = await getOrganizationStatuses();

      const formattedStatuses = (data || []).map((item: any) => ({
        id: item.identifier,
        name: item.name,
      }));

      setStatusOptions(formattedStatuses);
    } catch (err) {
      const errorMessage = 'Failed to load statuses';
      setError(errorMessage);
      console.error(err);
    }
  }, []);

  const createPolicy = useCallback(
    async (policyData: any): Promise<EscalationPolicy> => {
      try {
        setError(null);
        const newPolicy = await createEscalationPolicy(policyData);
        await loadPolicies();
        return newPolicy;
      } catch (err) {
        const errorMessage = 'Failed to create escalation policy';
        setError(errorMessage);
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
        setError(null);
        const updatedPolicy = await updateEscalationPolicy(
          identifier,
          policyData,
        );
        await loadPolicies();
        return updatedPolicy;
      } catch (err) {
        const errorMessage = 'Failed to update escalation policy';
        setError(errorMessage);
        throw err;
      }
    },
    [loadPolicies],
  );

  const deletePolicy = useCallback(
    async (identifier: string): Promise<void> => {
      try {
        setError(null);
        await deleteEscalationPolicy(identifier);
        await loadPolicies();
      } catch (err) {
        const errorMessage = 'Failed to delete escalation policy';
        setError(errorMessage);
        throw err;
      }
    },
    [loadPolicies],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

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
    error,
    loadPolicies,
    loadTaskLists,
    loadUsersAndGroups,
    loadWorkflows,
    loadStatuses,
    createPolicy,
    updatePolicy,
    deletePolicy,
    clearError,
  };
};

export default useEscalationPolicies;
