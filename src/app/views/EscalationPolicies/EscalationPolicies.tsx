import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import BasicLayoutHeader from '@/app/components/template/BasicLayoutHeader/BasicLayoutHeader';
import ViewLayout from '@/app/components/template/ViewLayout/ViewLayout';
import {
  Box,
  Typography,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import moment from 'moment';
import { openModal } from '@/app/modal/actions';
import {
  MainContainer,
  AddTaskButtonWrapper,
  AddTaskButtonLabel,
  HeaderBox,
  NoPoliciesText,
  ScopeAndTrigger,
  FiltersAndActions,
  TriggerBadge,
  DetailItem,
  StrongLabel,
  StatusIndicator,
  IconWrapper,
  DeletIcon,
  EditIcon,
  DetailItem1,
  FilterBulletList,
  FilterBulletItem,
  ActionBulletList,
  ActionBulletItem,
  PolicyContainerBox,
  PolicyHeaderBox,
  PolicySummaryBox,
  PolicyTitleBox,
  PolicyMetadataBox,
  PolicyDetailsBox,
  PolicyFooterBox,
  PolicyFooterMetadataBox,
  PolicyFooterActionsBox,
  LoadingBox,
  LoadingText,
  AccordionSx,
  AccordionSummarySx,
  AccordionDetailsSx,
  PolicyTitleTypography,
  PolicyDescriptionTypography,
  ErrorAlert,
} from './styled';
import {
  formatFilterDetails,
  formatTriggerDetails,
  formatActionDetails,
  ActionDetail,
} from '@/app/views/EscalationPolicies/helper';
import { Add } from '@mui/icons-material';
import { useEscalationPolicies } from '@/app/hooks/useEscalationPolicies';
import { getEscalationPolicyById } from '@/app/api/escalation-policy-api';
import { EscalationPolicy } from '@/app/types/escalationPolicy';

const EscalationPolicies = () => {
  const dispatch = useDispatch();
  const {
    policies,
    userOptions,
    groupOptions,
    listOptions,
    workflowOptions,
    statusOptions,
    loading,
    loadPolicies,
    deletePolicy,
  } = useEscalationPolicies();

  const [expandedPolicies, setExpandedPolicies] = useState<{
    [key: string]: boolean;
  }>({});
  const [policyDetails, setPolicyDetails] = useState<{
    [key: string]: EscalationPolicy | null;
  }>({});
  const [loadingDetails, setLoadingDetails] = useState<{
    [key: string]: boolean;
  }>({});

  const handleNewPolicy = () => {
    dispatch(
      openModal('CreateEscalationPolicy', {
        userOptions,
        groupOptions,
        listOptions,
        workflowOptions,
        statusOptions,
        onConfirm: () => {
          loadPolicies();
        },
      }),
    );
  };

  const handleEditPolicy = (policy: EscalationPolicy) => {
    dispatch(
      openModal('CreateEscalationPolicy', {
        editingPolicy: policy,
        userOptions,
        groupOptions,
        listOptions,
        workflowOptions,
        statusOptions,
        onConfirm: () => {
          loadPolicies();
          setPolicyDetails((prev) => ({
            ...prev,
            [policy.identifier!]: null,
          }));
        },
      }),
    );
  };

  const handleDeletePolicy = (identifier: string) => {
    dispatch(
      openModal('DeleteConfirmation', {
        title: 'Delete Escalation Policy',
        description:
          'Are you sure you want to delete this escalation policy? This action cannot be undone.',
        confirm: async () => {
          try {
            await deletePolicy(identifier);

            setExpandedPolicies((prev) => {
              const { [identifier]: removed, ...rest } = prev;
              return rest;
            });
            setPolicyDetails((prev) => {
              const { [identifier]: removed, ...rest } = prev;
              return rest;
            });
            setLoadingDetails((prev) => {
              const { [identifier]: removed, ...rest } = prev;
              return rest;
            });
          } catch (err) {
            console.error('Failed to delete policy:', err);
          }
        },
      }),
    );
  };

  const handleAccordionChange = async (identifier: string) => {
    const isExpanding = !expandedPolicies[identifier];

    setExpandedPolicies((prev) => ({
      ...prev,
      [identifier]: isExpanding,
    }));

    if (isExpanding && !policyDetails[identifier]) {
      setLoadingDetails((prev) => ({
        ...prev,
        [identifier]: true,
      }));

      try {
        const detailedPolicy = await getEscalationPolicyById(identifier);
        setPolicyDetails((prev) => ({
          ...prev,
          [identifier]: detailedPolicy,
        }));
      } catch (error) {
        console.error('Failed to fetch policy details:', error);
        setPolicyDetails((prev) => ({
          ...prev,
          [identifier]: null,
        }));
      } finally {
        setLoadingDetails((prev) => ({
          ...prev,
          [identifier]: false,
        }));
      }
    }
  };

  return (
    <ViewLayout header={<BasicLayoutHeader title="Escalation Policies" />}>
      <MainContainer>
        <HeaderBox>
          <PolicyHeaderBox>
            <AddTaskButtonWrapper onClick={handleNewPolicy}>
              <Add />
              <AddTaskButtonLabel>Add Policy</AddTaskButtonLabel>
            </AddTaskButtonWrapper>
          </PolicyHeaderBox>
        </HeaderBox>

        <PolicyContainerBox>
          {loading ? (
            <Typography>Loading policies...</Typography>
          ) : policies.length === 0 ? (
            <NoPoliciesText>
              No escalation policies found. Create your first policy to get
              started.
            </NoPoliciesText>
          ) : (
            policies.map((policy) => (
              <Accordion
                key={policy.identifier || policy.escalationPolicyId}
                expanded={expandedPolicies[policy.identifier!] || false}
                onChange={() => handleAccordionChange(policy.identifier!)}
                sx={AccordionSx}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls={`policy-${policy.identifier}-content`}
                  id={`policy-${policy.identifier}-header`}
                  sx={AccordionSummarySx}
                >
                  <PolicySummaryBox>
                    <PolicyTitleBox>
                      <PolicyTitleTypography variant="h5">
                        {policy.name}
                      </PolicyTitleTypography>
                      <StatusIndicator isActive={policy.enabled}>
                        {policy.enabled ? 'Active' : 'Inactive'}
                      </StatusIndicator>
                    </PolicyTitleBox>
                    {policy.description && (
                      <PolicyDescriptionTypography
                        variant="body2"
                        color="textSecondary"
                      >
                        {policy.description}
                      </PolicyDescriptionTypography>
                    )}
                    <PolicyMetadataBox>
                      {(policy.createdAt || policy.config?.createdDate) && (
                        <span>
                          Created:{' '}
                          {moment
                            .utc(policy.createdAt || policy.config?.createdDate)
                            .format('MMM DD, YYYY')}
                        </span>
                      )}
                      {(policy.updatedAt || policy.config?.updatedDate) &&
                        (policy.updatedAt || policy.config?.updatedDate) !==
                          (policy.createdAt || policy.config?.createdDate) && (
                          <span>
                            Updated:{' '}
                            {moment
                              .utc(
                                policy.updatedAt || policy.config?.updatedDate,
                              )
                              .format('MMM DD, YYYY')}
                          </span>
                        )}
                    </PolicyMetadataBox>
                  </PolicySummaryBox>
                </AccordionSummary>

                <AccordionDetails sx={AccordionDetailsSx}>
                  {loadingDetails[policy.identifier!] ? (
                    <LoadingBox>
                      <CircularProgress size={24} />
                      <LoadingText>Loading policy details...</LoadingText>
                    </LoadingBox>
                  ) : (
                    <Box>
                      {policyDetails[policy.identifier!] && (
                        <>
                          <PolicyDetailsBox>
                            <ScopeAndTrigger>
                              <DetailItem>
                                <StrongLabel>Scope </StrongLabel>
                                <TriggerBadge>
                                  {policyDetails[
                                    policy.identifier!
                                  ]?.config?.scope
                                    ?.toLowerCase()
                                    .replace('_', ' ') || 'N/A'}
                                </TriggerBadge>
                              </DetailItem>

                              <DetailItem>
                                <StrongLabel>Trigger</StrongLabel>
                                <TriggerBadge>
                                  {formatTriggerDetails(
                                    policyDetails[policy.identifier!]?.config
                                      ?.trigger,
                                  )}
                                </TriggerBadge>
                              </DetailItem>

                              <DetailItem>
                                <StrongLabel>Filters</StrongLabel>
                                <FilterBulletList>
                                  {formatFilterDetails(
                                    policyDetails[policy.identifier!]?.config
                                      ?.scopeFilter,
                                    policyDetails[policy.identifier!]
                                      ?.references,
                                  ).map((filter, idx) => (
                                    <FilterBulletItem key={idx}>
                                      {filter}
                                    </FilterBulletItem>
                                  ))}
                                </FilterBulletList>
                              </DetailItem>
                            </ScopeAndTrigger>

                            <FiltersAndActions>
                              <DetailItem1>
                                <StrongLabel>Actions</StrongLabel>
                                <ActionBulletList>
                                  {!policyDetails[policy.identifier!]?.config
                                    ?.actions ||
                                  policyDetails[policy.identifier!]!.config
                                    .actions.length === 0 ? (
                                    <ActionBulletItem>
                                      No actions configured
                                    </ActionBulletItem>
                                  ) : (
                                    formatActionDetails(
                                      policyDetails[policy.identifier!]!.config
                                        .actions,
                                      policyDetails[policy.identifier!]
                                        ?.references,
                                    ).map(
                                      (action: ActionDetail, idx: number) => (
                                        <ActionBulletItem key={idx}>
                                          {action.main}
                                          {action.subItems &&
                                            action.subItems.length > 0 && (
                                              <ul>
                                                {action.subItems.map(
                                                  (subItem, subIdx) => (
                                                    <li key={subIdx}>
                                                      {subItem}
                                                    </li>
                                                  ),
                                                )}
                                              </ul>
                                            )}
                                        </ActionBulletItem>
                                      ),
                                    )
                                  )}
                                </ActionBulletList>
                              </DetailItem1>
                            </FiltersAndActions>
                          </PolicyDetailsBox>

                          <PolicyFooterBox>
                            <PolicyFooterMetadataBox>
                              {(policyDetails[policy.identifier!]?.createdAt ||
                                policyDetails[policy.identifier!]?.config
                                  ?.createdDate) && (
                                <span>
                                  Created:{' '}
                                  {moment
                                    .utc(
                                      policyDetails[policy.identifier!]!
                                        .createdAt ||
                                        policyDetails[policy.identifier!]!
                                          .config?.createdDate,
                                    )
                                    .format('MMM DD, YYYY')}
                                </span>
                              )}
                              {(policyDetails[policy.identifier!]?.updatedAt ||
                                policyDetails[policy.identifier!]?.config
                                  ?.updatedDate) &&
                                (policyDetails[policy.identifier!]!.updatedAt ||
                                  policyDetails[policy.identifier!]!.config
                                    ?.updatedDate) !==
                                  (policyDetails[policy.identifier!]!
                                    .createdAt ||
                                    policyDetails[policy.identifier!]!.config
                                      ?.createdDate) && (
                                  <span>
                                    Updated:{' '}
                                    {moment
                                      .utc(
                                        policyDetails[policy.identifier!]!
                                          .updatedAt ||
                                          policyDetails[policy.identifier!]!
                                            .config?.updatedDate,
                                      )
                                      .format('MMM DD, YYYY')}
                                  </span>
                                )}
                            </PolicyFooterMetadataBox>
                            <PolicyFooterActionsBox>
                              <IconWrapper>
                                <EditIcon
                                  onClick={() =>
                                    handleEditPolicy(
                                      policyDetails[policy.identifier!]!,
                                    )
                                  }
                                />
                              </IconWrapper>
                              <IconWrapper>
                                <DeletIcon
                                  onClick={() =>
                                    handleDeletePolicy(policy.identifier!)
                                  }
                                />
                              </IconWrapper>
                            </PolicyFooterActionsBox>
                          </PolicyFooterBox>
                        </>
                      )}
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </PolicyContainerBox>
      </MainContainer>
    </ViewLayout>
  );
};

export default EscalationPolicies;
