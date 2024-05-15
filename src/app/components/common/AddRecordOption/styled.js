import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';

export const AdornmentContainer = styled.div`
  align-items: center;
  color: ${palette.brightBlue};
  justify-content: center;
  position: relative;
  display: inline;
  top: -0px;

  &::first-letter {
    font-size: 20px;
  }
`;

export const AddText = styled.span`
  display: flex;
  padding: 3px 8px;
`;

export const ListItemButton = styled.button`
  width: 100%;
  cursor: pointer;
  font-family: inherit;

  ${({ isHovered }) => isHovered && `background: ${palette.blueGrey};`}
`;

export const ListItemCustomText = styled.button`
  padding: 15px 0 0 12px;
  display: flex;
  cursor: pointer;
`;

export const NoPatientFound = styled.div`
  font-family: inherit;
  text-align: center;
  color: ${palette.coolGrey1};
  padding-bottom: ${spacing.tiny};
`;
