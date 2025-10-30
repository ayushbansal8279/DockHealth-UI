import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { TOrganization } from 'types/organization';
import { useCredentialsQuery } from '@/app/react-query/developer-credentials/useCredentialsQuery';
import { useDeleteCredential } from '@/app/react-query/developer-credentials/useDeleteCredential';
import { useCreateCredential } from '@/app/react-query/developer-credentials/useCreateCredential';
import { organizationSelector } from 'selectors/organization-selectors';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import { openModal, closeModal } from '@/app/modal/actions';
import { formatEllipsisText } from 'helpers/formatters';
import {
  MainContainer,
  AddTaskButtonWrapper,
  AddTaskButtonLabel,
  HeaderBox,
  HeaderTitle,
  IdentifiersBox,
  CredentialContainerBox,
  CredentialSummaryBox,
  CredentialTitleBox,
  CredentialMetadataBox,
  CredentialDetailsBox,
  FieldsColumn,
  DetailItem,
  StrongLabel,
  ValueText,
  CredentialFooterBox,
  CredentialFooterMetadataBox,
  CredentialFooterActionsBox,
  DeleteIcon,
  NoCredentialsText,
  LoadingBox,
  LoadingText,
  CredentialTitleTypography,
  ScopesContainer,
  ScopeBadge,
  AccordionSx,
  AccordionSummarySx,
  AccordionDetailsSx,
} from './styled';
import CopyableField from './CopyableField';

const DevelopersPage = () => {
  const dispatch = useDispatch();
  const organization = useSelector(organizationSelector) as TOrganization;
  const { userIdentifier, organizationIdentifier } =
    useSelector(userProfileSelector);
  const organizationId = organization?.organizationIdentifier;

  const [expanded, setExpanded] = useState<string | false>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const credentialsQuery = useCredentialsQuery({
    orgId: organizationId,
    options: {
      enabled: !!organizationId,
    },
  });

  const deleteCredential = useDeleteCredential();
  const createCredential = useCreateCredential({
    orgId: organizationIdentifier,
  });

  const handleScopesConfirm = useCallback(
    (scopes: string[]) => {
      createCredential.mutate(scopes);
    },
    [createCredential],
  );

  const handleAddCredentialClick = useCallback(() => {
    dispatch(
      openModal('DeveloperScopeList', { onConfirm: handleScopesConfirm }),
    );
  }, [dispatch, handleScopesConfirm]);

  const handleDeleteClick = useCallback(
    (credential: any) => {
      const modalProps = {
        apiKey: credential.apiKey,
        confirm: () => {
          deleteCredential.mutate({
            orgId: organizationIdentifier,
            orgDeveloperIdentifier: credential.orgDeveloperIdentifier,
          });
          dispatch(closeModal());
        },
      };
      dispatch(openModal('DeleteCredentialConfirm', modalProps));
    },
    [dispatch, deleteCredential, organizationIdentifier],
  );

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleCopyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedField(fieldKey);
        setTimeout(() => setCopiedField(null), 2000);
      })
      .catch((err) => console.error('Unable to copy text to clipboard', err));
  };

  const getScopesString = (scopes: string[]): string => {
    return Array.isArray(scopes) ? scopes.join(', ') : '';
  };

  const credentials = credentialsQuery.data || [];

  return (
    <ViewLayout header={<BasicLayoutHeader title="API Credentials" />}>
      <MainContainer>
        <CredentialContainerBox>
          <HeaderBox>
            <HeaderTitle>Developer API Keys</HeaderTitle>
            <AddTaskButtonWrapper onClick={handleAddCredentialClick}>
              <AddIcon />
              <AddTaskButtonLabel>Add Credential</AddTaskButtonLabel>
            </AddTaskButtonWrapper>
          </HeaderBox>

          <IdentifiersBox>
            <CopyableField
              label="User Identifier"
              value={userIdentifier}
              fieldKey="user-identifier"
              copiedField={copiedField}
              onCopy={handleCopyToClipboard}
              variant="identifier"
            />

            <CopyableField
              label="Organization Identifier"
              value={organizationIdentifier}
              fieldKey="org-identifier"
              copiedField={copiedField}
              onCopy={handleCopyToClipboard}
              variant="identifier"
            />
          </IdentifiersBox>

          {credentialsQuery.isLoading ? (
            <LoadingBox>
              <CircularProgress size={24} />
              <LoadingText>Loading credentials...</LoadingText>
            </LoadingBox>
          ) : credentials.length === 0 ? (
            <NoCredentialsText variant="body1">
              No API credentials configured. Click "Add Credential" to create
              one.
            </NoCredentialsText>
          ) : (
            credentials.map((credential, idx) => (
              <Accordion
                key={credential.clientId}
                expanded={expanded === credential.clientId}
                onChange={handleAccordionChange(credential.clientId)}
                sx={AccordionSx}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={AccordionSummarySx}
                >
                  <CredentialSummaryBox>
                    <CredentialTitleBox>
                      <CredentialTitleTypography variant="h5">
                        API Key #{idx + 1}
                      </CredentialTitleTypography>
                    </CredentialTitleBox>
                    <ValueText>
                      Domain Name: {credential.domain || 'Not specified'}
                    </ValueText>
                    <CredentialMetadataBox>
                      <span>
                        {getScopesString(credential.scopes).split(',').length}{' '}
                        scope(s)
                      </span>
                    </CredentialMetadataBox>
                  </CredentialSummaryBox>
                </AccordionSummary>

                <AccordionDetails sx={AccordionDetailsSx}>
                  <CredentialDetailsBox>
                    <FieldsColumn>
                      <CopyableField
                        label="Domain Name"
                        value={credential.domain}
                        fieldKey={`${credential.clientId}-domain`}
                        copiedField={copiedField}
                        onCopy={handleCopyToClipboard}
                      />

                      <CopyableField
                        label="API Key"
                        value={credential.apiKey}
                        fieldKey={`${credential.clientId}-apikey`}
                        copiedField={copiedField}
                        onCopy={handleCopyToClipboard}
                        formatValue={formatEllipsisText}
                      />

                      <CopyableField
                        label="Client ID"
                        value={credential.clientId}
                        fieldKey={`${credential.clientId}-clientid`}
                        copiedField={copiedField}
                        onCopy={handleCopyToClipboard}
                        formatValue={formatEllipsisText}
                      />

                      <CopyableField
                        label="Client Secret"
                        value={credential.clientSecret}
                        fieldKey={`${credential.clientId}-secret`}
                        copiedField={copiedField}
                        onCopy={handleCopyToClipboard}
                        formatValue={formatEllipsisText}
                      />
                    </FieldsColumn>

                    <FieldsColumn>
                      <DetailItem>
                        <StrongLabel>Scopes </StrongLabel>
                        <ScopesContainer>
                          {credential.scopes && credential.scopes.length > 0 ? (
                            credential.scopes.map(
                              (scope: string, scopeIdx: number) => (
                                <ScopeBadge key={scopeIdx}>{scope}</ScopeBadge>
                              ),
                            )
                          ) : (
                            <ValueText>No scopes</ValueText>
                          )}
                        </ScopesContainer>
                      </DetailItem>
                    </FieldsColumn>
                  </CredentialDetailsBox>

                  <CredentialFooterBox>
                    <CredentialFooterActionsBox>
                      <Tooltip title="Delete credential">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(credential)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </CredentialFooterActionsBox>
                  </CredentialFooterBox>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </CredentialContainerBox>
      </MainContainer>
    </ViewLayout>
  );
};

export default DevelopersPage;
