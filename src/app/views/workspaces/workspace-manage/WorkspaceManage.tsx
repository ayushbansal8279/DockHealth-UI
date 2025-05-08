import HeaderSearch from '@/app/components/template/HeaderSearch/HeaderSearch';
import { openModal } from '@/app/modal/actions';
import { Add } from '@mui/icons-material';
import { Box } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import WorkspaceTable from '../workspace-table/WorkspaceTable';
import { workspacesDummyData } from './helper';
import {
  AddWorkspaceButtonLabel,
  AddWorkspaceButtonWrapper,
  Container,
  SubHeader,
  TableWrapper,
} from './styled';

const WorkspaceManage = () => {
  const dispatch = useDispatch();

  const openAddWorkspaceModal = () => {
    dispatch(openModal('AddWorkspace'));
  };

  return (
    <Container>
      <SubHeader>
        <HeaderSearch />
        <Box ml={1}>
          <AddWorkspaceButtonWrapper onClick={openAddWorkspaceModal}>
            <Add />
            <AddWorkspaceButtonLabel>Add Workspace</AddWorkspaceButtonLabel>
          </AddWorkspaceButtonWrapper>
        </Box>
      </SubHeader>
      <TableWrapper>
        <WorkspaceTable workspaces={workspacesDummyData} />
      </TableWrapper>
    </Container>
  );
};

export default WorkspaceManage;
