import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import palette from '../palette';

export const InfoPanelContainer = styled.div`
  background-color: ${palette.white};
  border: 0.125rem solid ${palette.unknownGrey2};
  margin: 0 0 1.5rem;
  max-width: 1050px;
  padding: 1rem;
  width: 100%;
`;

export const PersonNameContainer = styled(Grid).attrs({
  container: true,
  direction: 'row',
  item: true,
  md: 5,
  sm: 12,
  wrap: 'nowrap',
})`
  padding: 1.375rem;
`;

export const PersonInitialsContainer = styled.span`
  color: ${palette.white};
  font-size: 1.875rem;
  font-weight: bold;
`;

export const PersonTitlesContainer = styled(Grid).attrs({
  container: true,
  direction: 'column',
  justify: 'center',
})`
  padding-left: 1.375rem;
`;

export const Label = styled.span`
  font-size: 1rem;
  display: block;
  line-height: 1.2;
  margin: 0.125rem 0;
`;

export const GreyLabel = styled(Label)`
  color: ${palette.unknownGrey5};
`;

export const BoldLabel = styled(Label)`
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.4;
`;

export const PersonAvatarContainer = styled.div`
  min-width: 102px;
  width: 102px;
`;

export const ArchivePersonButton = styled.button`
  color: ${palette.lighterCyanBlue};
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    filter: brightness(1.25);
  }
`;

export const PersonImage = styled.img`
  object-fit: cover;
  height: 100%;
  width: 100%;
`;
