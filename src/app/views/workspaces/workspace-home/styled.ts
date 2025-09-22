import palette from "@/app/styles/palette";
import { Skeleton } from "@mui/material";
import styled from "styled-components";

export const WorkspaceSubWrapper = styled.div`
  margin-left: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  cursor: pointer;
`;

export const DrawerListsItemLoader = styled(Skeleton)`
  &&& {
    &.MuiSkeleton-root {
      height: 24px;
      margin-bottom: 10px;
    }
  }
`;

export const ListContainer = styled.div`
  background-color: ${palette.white};
  padding: 1rem;
`;

export const ListEntryContainer = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  margin: 0 0.5rem;
  padding: 1rem 0.5rem;

  &:not(:last-child) {
    border-bottom: 1px solid ${palette.unknownGrey6};
  }
`;

export const WorkspaceContainer = styled.div`
  width: 100%;
  max-width: 1179px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

export const AddWorkspaceButtonWrapper = styled.div`
  margin-bottom: 12px;
  display: flex;
  justify-content: flex-end;
`;

export const WorkspaceTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  display: flex;
  justify-content: center;
`;