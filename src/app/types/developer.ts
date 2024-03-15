export interface TApiKey {
  domainName: string;
  apiKey: string;
  clientId: string;
  clientSecret: string;
}

export interface TCreateApiKeyMutationParams {
  organizationIdentifier: string;
  sendEmail?: boolean;
}
