import styled from 'styled-components';
import { Popover } from '@material-ui/core';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const StyledPopover = styled(Popover)`
  min-width: 230px;
`;

export const Input = styled.input`
  border: none;
  width: 100%;
  outline: none;
  margin-left: ${spacing.tiny};
`;

export const InputBox = styled.div`
  display: flex;
  padding: ${spacing.regular} ${spacing.huge};
  border-bottom: 1px solid rgba(193, 204, 218, 0.25);
  font-size: ${fontSizes.smallPlus};
`;

export const Box = styled.div`
  max-height: 260px;
  overflow-y: scroll;
`;

export const MembersBox = styled.div`
  display: flex;
  flex-direction: column;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regularPlus};
  border-bottom: 1px solid rgba(193, 204, 218, 0.25);
  padding: ${spacing.small} 0;
`;

export const AssignToMeBox = styled(MembersBox)`
  color: ${palette.darkGrey};
`;

export const StyledMembersList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MemberRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${spacing.small} ${spacing.huge};
  cursor: pointer;
  color: ${palette.ligthGrey};
  & > span {
    margin-left: ${spacing.small};
  }

  &:hover {
    background-color: rgba(193, 204, 218, 0.25);
  }
`;

export const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${spacing.regularPlus} 0;
`;
