import React from 'react';
import { Box } from '@mui/material';
import BasicLayoutHeader from '../template/BasicLayoutHeader/BasicLayoutHeader';
import { WORKSPACE_PATH } from '@/app/routing/helpers/paths';
import { BreadcrumbLink, BreadcrumbSeparator } from './styled';

const ProfileBuilderHeader = ({
  scope,
  profileName,
  workspaceName,
  workspaceLabel,
  organizationName,
}) => {
  const renderBreadcrumb = () => {
    const breadcrumbParts = [];

    if (scope === 'workspace' && workspaceName) {
      breadcrumbParts.push(
        <BreadcrumbLink key="workspace-label" to={WORKSPACE_PATH}>
          {workspaceLabel}
        </BreadcrumbLink>,
      );
      breadcrumbParts.push(
        <BreadcrumbSeparator key="sep1">/</BreadcrumbSeparator>,
      );
      breadcrumbParts.push(
        <span key="workspace-name">{workspaceName}</span>,
      );
    } else if (scope === 'org' && organizationName) {
      breadcrumbParts.push(
        <span key="org-name">{organizationName}</span>,
      );
    }

    if (profileName) {
      if (breadcrumbParts.length > 0) {
        breadcrumbParts.push(
          <BreadcrumbSeparator key="sep2">/</BreadcrumbSeparator>,
        );
      }
      breadcrumbParts.push(<span key="profile-name">{profileName}</span>);
    }

    return (
      <Box display="flex" alignItems="center" flex={1} overflow="hidden">
        {breadcrumbParts}
      </Box>
    );
  };

  return (
    <BasicLayoutHeader
      title={renderBreadcrumb()}
    />
  );
};

export default ProfileBuilderHeader;

