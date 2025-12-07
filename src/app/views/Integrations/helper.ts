export interface IntegrationAuthField {
  key: string;
  name: string;
  type?: string;
  required?: boolean;
}

export interface Integration {
  identifier: string;
  integrationName: string;
  integrationCode: string;
  enabled: boolean;
  settingsTemplate?: {
    authInfo?: IntegrationAuthField[];
  };
  createdDate?: string;
  updatedDate?: string;
  organizationIdentifier?: string;
}

export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getIntegrationName = (integration: Integration): string => {
  return integration.integrationName || integration.identifier;
};

export const getFieldCount = (integration: Integration): number => {
  return integration.settingsTemplate?.authInfo?.length || 0;
};
