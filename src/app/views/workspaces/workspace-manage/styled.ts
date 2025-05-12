import palette from "@/app/styles/palette";
import spacing from "@/app/styles/spacing";
import { Button, Typography } from "@mui/material";
import styled from "styled-components";

export const Container = styled.div``;

export const TableWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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