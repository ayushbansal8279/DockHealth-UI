import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';
import { Popper } from '@mui/material';

export const StyledPopper = styled(Popper)`
  left: -32px !important;
  top: 25px !important;
`;

export const Arrow = styled.div({
  display: 'block',
  position: 'absolute',
  width: '3em',
  height: '3em',
  right: '36px',
  '::before': {
    content: "''",
    margin: 'auto',
    display: 'block',
    width: 0,
    height: 0,
    borderLeft: '20px solid transparent',
    borderRight: '20px solid transparent',
    borderBottom: '20px solid white',
    top: '-16px',
    position: 'absolute',
  },
});

export const ListContainer = styled.div`
  height: 290px;
  width: 306px;
  overflow-y: auto;
`;

export const ListContentSection = styled.div`
  height: auto;
  width: 100%;
  padding: ${spacing.tiny};
  border-top: 1px solid ${palette.coolGrey3};
  background-color: white;
`;

export const UserStatusLabel = styled.p`
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: inherit;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regularPlus};
  margin-bottom: 0;
`;
