import palette from "@/app/styles/palette";
import spacing from "@/app/styles/spacing";
import { Button, Typography } from "@mui/material";
import styled from "styled-components";

export const BulkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  left: 24px;
`;

export const WorkspaceUsersContainer = styled.div``;

export const WorkspaceUsersHeader = styled.div`
  display: flex;
  margin: 20px;
  justify-content: space-between;
`;

export const WorkspaceUsersTableWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledActionButtonWrapper = styled(Button)`
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

export const StyledActionButtonLabel = styled(Typography)`
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