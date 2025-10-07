export interface EscalationPolicy {
  escalationPolicyId?: number;
  identifier?: string;
  name: string;
  description?: string;
  enabled?: boolean;
  config: {
    scope: string;
    scopeFilter: any;
    trigger: {
      timestampField: string;
      overdueValue: number;
      overdueUnit: string;
    };
    actions: any[];
    createdDate?: string;
    updatedDate?: string;
  };
  references?: {
    users?: Array<{ identifier: string; name: string }>;
    groups?: Array<{ identifier: string; name: string }>;
    lists?: Array<{ identifier: string; name: string }>;
    workflows?: Array<{ identifier: string; name: string }>;
    patients?: Array<{ identifier: string; name: string }>;
    statuses?: Array<{ identifier: string; name: string }>;
  };
  organizationIdentifier?: string;
  organizationName?: string;
  userIdentifier?: string;
  userName?: string;
  createdAt?: string;
  updatedAt?: string;
}