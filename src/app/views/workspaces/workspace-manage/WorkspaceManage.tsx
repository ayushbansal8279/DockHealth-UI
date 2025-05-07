import HeaderSearch from '@/app/components/template/HeaderSearch/HeaderSearch';
import { openModal } from '@/app/modal/actions';
import palette from '@/app/styles/palette';
import spacing from '@/app/styles/spacing';
import { Add } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import WorkspaceTable from '../workspace-table/WorkspaceTable';

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
        <WorkspaceTable />
      </TableWrapper>
    </Container>
  );
};

export default WorkspaceManage;

export const Container = styled.div`
  // background-color: ;
  // min-height: 100vh;
`;
export const TableWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  // background-color: ;
  // min-height: 100vh;
`;

export const AddWorkspaceButtonWrapper = styled(Button)`
  && {
    border-radius: 4px;
    background-color: ${palette.newDarkBlue};
  }
  & .MuiSvgIcon-root > path {
    fill: ${palette.white};
  }
  height: 32px;
  width: 150px;
`;

export const AddWorkspaceButtonLabel = styled(Typography)`
  &&& {
    &.MuiTypography-root {
      color: ${palette.white};
      display: inline-block;
      margin-left: ${spacing.tiny};
      text-transform: none;
      font-size: 14px;
      font-weight: 500;
      line-height: 11.19px;
      text-align: center;
      margin-right: 5px;
    }
  }
`;

export const SubHeader = styled.div`
  display: flex;
  margin: 20px;
  justify-content: space-between;
`;
