import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';

export const AdornmentContainer = styled.div`
  align-items: center;
  align-self: flex-end;
  color: ${palette.orange};
  justify-content: center;
  margin-bottom: 0.3rem;
  width: 2ch;
  position: relative;
  display: inline;
  top: -0px;
`;

export const AddText = styled.span`
  display: flex;
  padding: 4px;
`;

export const ListItemButton = styled.button`
  width: 100%;
  cursor: pointer;
  font-family: ${typography.text};

  ${({ isHovered }) => isHovered && `background: ${palette.blueGrey};`}
`;

export const ListItemCustomText = styled.button`
  padding: 10px;
  display: flex;
  cursor: pointer;
`;

export const NoPatientFound = styled.div`
  font-family: ${typography.text};
  text-align: center;
  color: ${palette.coolGrey1};
  padding-bottom: ${spacing.tiny};
`;
