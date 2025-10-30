import BasicLayoutHeader from '@/app/components/template/BasicLayoutHeader/BasicLayoutHeader';
import React, { useCallback, useEffect, useState } from 'react';
import {
  MainContainer,
  AddTaskButtonWrapper,
  AddTaskButtonLabel,
  HeaderBox,
  HeaderTitle,
  IntegrationContainerBox,
  IntegrationSummaryBox,
  IntegrationTitleBox,
  IntegrationMetadataBox,
  IntegrationDetailsBox,
  FieldsColumn,
  DetailItem,
  StrongLabel,
  ValueText,
  StatusIndicator,
  IntegrationFooterBox,
  IntegrationFooterMetadataBox,
  IntegrationFooterActionsBox,
  EditIcon,
  NoIntegrationsText,
  LoadingBox,
  LoadingText,
  IntegrationTitleTypography,
  FieldValue,
  AccordionSx,
  AccordionSummarySx,
  AccordionDetailsSx,
} from './styled';
import { useDispatch } from 'react-redux';
import { openModal } from '@/app/modal/actions';
import ViewLayout from '@/app/components/template/ViewLayout/ViewLayout';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  IconButton,
  Tooltip,
  Switch,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import {
  getEnabledDockIntegrationsForOrg,
  updateIntegrationToOrg,
} from '@/app/api/integration-api';
import {
  Integration,
  formatDate,
  getIntegrationName,
  getFieldCount,
} from './helper';

export default function IntegrationsHeader() {
  const dispatch = useDispatch();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setLoading(true);
    try {
      const data = await getEnabledDockIntegrationsForOrg();
      setIntegrations(data);
    } catch (error) {
      console.error('Failed to load integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIntegrationClick = useCallback(() => {
    dispatch(
      openModal('DockIntegrations', {
        onConfirm: () => {
          loadIntegrations();
        },
      }),
    );
  }, [dispatch]);

  const handleEditClick = useCallback(
    (integration: Integration) => {
      dispatch(
        openModal('EditIntegration', {
          integration,
          onSuccess: loadIntegrations,
        }),
      );
    },
    [dispatch],
  );

  const handleToggleEnabled = useCallback(
    (integration: Integration, newStatus: boolean) => {
      const actionLabel = newStatus ? 'enable' : 'disable';

      dispatch(
        openModal('Confirmation', {
          title: `Confirm ${actionLabel}`,
          description: `Are you sure you want to ${actionLabel} the integration "${integration.integrationName}"?`,
          timeout: 5000,
          confirm: async () => {
            try {
              await updateIntegrationToOrg({
                enabled: newStatus,
                integrationCode: integration.integrationCode,
                integrationName: integration.integrationName,
              });
              setIntegrations((prev) =>
                prev.map((i) =>
                  i.identifier === integration.identifier
                    ? { ...i, enabled: newStatus }
                    : i,
                ),
              );
            } catch (error) {
              console.error('Failed to update integration status:', error);
            }
          },
        }),
      );
    },
    [dispatch],
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

  return (
    <ViewLayout header={<BasicLayoutHeader title="Integrations" />}>
      <MainContainer>
        <IntegrationContainerBox>
          <HeaderBox>
            <HeaderTitle>Dock Integrations</HeaderTitle>
            <AddTaskButtonWrapper onClick={handleAddIntegrationClick}>
              <AddIcon />
              <AddTaskButtonLabel>Add Integration</AddTaskButtonLabel>
            </AddTaskButtonWrapper>
          </HeaderBox>

          {loading ? (
            <LoadingBox>
              <CircularProgress size={24} />
              <LoadingText>Loading integrations...</LoadingText>
            </LoadingBox>
          ) : integrations.length === 0 ? (
            <NoIntegrationsText variant="body1">
              No integrations configured. Click "Add Integration" to get
              started.
            </NoIntegrationsText>
          ) : (
            integrations.map((integration) => (
              <Accordion
                key={integration.identifier}
                expanded={expanded === integration.identifier}
                onChange={handleAccordionChange(integration.identifier)}
                sx={AccordionSx}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={AccordionSummarySx}
                >
                  <IntegrationSummaryBox>
                    <IntegrationTitleBox>
                      <IntegrationTitleTypography variant="h5">
                        {getIntegrationName(integration)}
                      </IntegrationTitleTypography>
                      <StatusIndicator isActive={integration.enabled}>
                        {integration.enabled ? 'ENABLED' : 'DISABLED'}
                      </StatusIndicator>
                    </IntegrationTitleBox>
                    <ValueText>
                      {getFieldCount(integration)} configuration field(s)
                    </ValueText>
                    <IntegrationMetadataBox>
                      {integration.createdDate && (
                        <span>
                          Added: {formatDate(integration.createdDate)}
                        </span>
                      )}
                      {integration.updatedDate && (
                        <span>
                          Updated: {formatDate(integration.updatedDate)}
                        </span>
                      )}
                    </IntegrationMetadataBox>
                  </IntegrationSummaryBox>
                </AccordionSummary>

                <AccordionDetails sx={AccordionDetailsSx}>
                  <IntegrationDetailsBox>
                    <FieldsColumn>
                      <DetailItem>
                        <StrongLabel>Code </StrongLabel>
                        <Tooltip
                          title={
                            copiedField === `${integration.identifier}-code`
                              ? 'Copied!'
                              : 'Click to copy code'
                          }
                          placement="top"
                          arrow
                        >
                          <FieldValue
                            onClick={() =>
                              handleCopyToClipboard(
                                integration.integrationCode,
                                `${integration.identifier}-code`,
                              )
                            }
                          >
                            {integration.integrationCode}
                          </FieldValue>
                        </Tooltip>
                      </DetailItem>

                      {integration.settingsTemplate?.authInfo &&
                        integration.settingsTemplate.authInfo.length > 0 && (
                          <>
                            <DetailItem>
                              <StrongLabel>Fields </StrongLabel>
                              <div>
                                {integration.settingsTemplate.authInfo.map(
                                  (field, index) => {
                                    const fieldKey = `${integration.identifier}-${field.key}`;
                                    const isCopied = copiedField === fieldKey;
                                    return (
                                      <Tooltip
                                        key={field.key}
                                        title={
                                          isCopied
                                            ? 'Copied!'
                                            : 'Click to copy field name'
                                        }
                                        placement="top"
                                        arrow
                                      >
                                        <FieldValue
                                          onClick={() =>
                                            handleCopyToClipboard(
                                              field.name,
                                              fieldKey,
                                            )
                                          }
                                        >
                                          {field.name}
                                          {field.required && ' *'}
                                        </FieldValue>
                                      </Tooltip>
                                    );
                                  },
                                )}
                              </div>
                            </DetailItem>
                          </>
                        )}
                    </FieldsColumn>

                    <FieldsColumn>
                      <DetailItem>
                        <StrongLabel>Status </StrongLabel>
                        <Switch
                          checked={!!integration.enabled}
                          onChange={(e) =>
                            handleToggleEnabled(integration, e.target.checked)
                          }
                          inputProps={{ 'aria-label': 'Enable Integration' }}
                          size="small"
                        />
                      </DetailItem>
                    </FieldsColumn>
                  </IntegrationDetailsBox>

                  <IntegrationFooterBox>
                    <IntegrationFooterActionsBox>
                      <Tooltip title="Edit integration">
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(integration)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </IntegrationFooterActionsBox>
                  </IntegrationFooterBox>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </IntegrationContainerBox>
      </MainContainer>
    </ViewLayout>
  );
}
