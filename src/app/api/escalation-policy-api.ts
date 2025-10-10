import axios from './axios-heydoc';
import { log } from '../helpers/log';
import { showGlobalAlert, showGlobalErrorAlert } from '../alert/actions';
import store from '../store';
import { EscalationPolicy } from '../types/escalationPolicy';

const ESCALATION_POLICY_ENDPOINT = '/organization/escalationPolicy';

export async function getAllEscalationPolicies(): Promise<EscalationPolicy[]> {
  try {
    const response = await axios.get(ESCALATION_POLICY_ENDPOINT);
    log(response.data);
    return response.data || [];
  } catch (error) {
    log(error);
    store.dispatch(showGlobalErrorAlert('Failed to fetch escalation policies'));
    throw error;
  }
}

export async function createEscalationPolicy(policyData: any): Promise<EscalationPolicy> {
  try {
    const policyDto = {
      config: {
        scope: policyData.scope,
        scopeFilter: policyData.scopeFilter,
        trigger: policyData.trigger,
        actions: policyData.actions,
        createdDate: policyData.createdDate,
        updatedDate: policyData.updatedDate
      },
      description: policyData.description || '',
      enabled: true,
      name: policyData.name
    };

    const response = await axios.post(ESCALATION_POLICY_ENDPOINT, policyDto);
    store.dispatch(showGlobalAlert('Escalation policy created successfully'));
    return response.data;
  } catch (error) {
    log(error);
    store.dispatch(showGlobalErrorAlert('Failed to create escalation policy'));
    throw error;
  }
}

export async function updateEscalationPolicy(identifier: string, policyData: Partial<any>): Promise<EscalationPolicy> {
  try {
    const policyDto = {
      config: {
        scope: policyData.scope,
        scopeFilter: policyData.scopeFilter,
        trigger: policyData.trigger,
        actions: policyData.actions,
        createdDate: policyData.createdDate,
        updatedDate: policyData.updatedDate
      },
      description: policyData.description || '',
      enabled: policyData.enabled !== undefined ? policyData.enabled : true,
      name: policyData.name
    };

    const response = await axios.patch(`${ESCALATION_POLICY_ENDPOINT}/${identifier}`, policyDto);
    store.dispatch(showGlobalAlert('Escalation policy updated successfully'));
    return response.data;
  } catch (error) {
    log(error);
    store.dispatch(showGlobalErrorAlert('Failed to update escalation policy'));
    throw error;
  }
}

export async function getEscalationPolicyById(identifier: string): Promise<EscalationPolicy> {
  try {
    const response = await axios.get(`${ESCALATION_POLICY_ENDPOINT}/${identifier}`);
    return response.data;
  } catch (error) {
    log(error);
    store.dispatch(showGlobalErrorAlert('Failed to fetch escalation policy'));
    throw error;
  }
}

export async function deleteEscalationPolicy(identifier: string): Promise<void> {
  try {
    await axios.delete(`${ESCALATION_POLICY_ENDPOINT}/${identifier}`);
    store.dispatch(showGlobalAlert('Escalation policy deleted successfully'));
  } catch (error) {
    log(error);
    store.dispatch(showGlobalErrorAlert('Failed to delete escalation policy'));
    throw error;
  }
}
