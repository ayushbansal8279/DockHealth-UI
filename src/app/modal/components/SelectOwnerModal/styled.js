import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette, { typography } from 'styles/palette';

export const UsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: ${spacing.regular} 0 ${spacing.huge};
  padding: 0 ${spacing.small};
  max-height: 300px;
`;

export const UsersList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  overflow-y: auto;
`;

export const UserItem = styled.button`
  display: flex;
  align-items: center;
  padding: ${spacing.tiny} ${spacing.regularPlus};
  outline: none;
  font-family: inherit;
  color: ${palette.mediumGrey};
  background-color: ${(props) =>
    props.isSelected && palette.brightBlueWithAlpha};
  cursor: pointer;
`;

export const UserName = styled.span`
  padding-left: ${spacing.smallPlus};
`;

export const SearchUserInputContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${palette.unknownGrey6};
  padding-bottom: ${spacing.small};
  padding-right: ${spacing.smallPlus};
  margin: 0 ${spacing.regularPlus} ${spacing.large};
`;

export const SearchUserInput = styled.input`
  outline: none;
  border: none;
  width: 100%;
`;

export const UserNotFound = styled.div`
  padding: ${spacing.tiny} ${spacing.regularPlus};
`;
