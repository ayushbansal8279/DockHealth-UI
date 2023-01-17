import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import palette from 'styles/palette';

export const ListWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  border: 1px solid ${palette.coolGrey2};
  overflow-y: auto;
  overflow-x: hidden;
`;

export const useMenuItemStyles = makeStyles({
  root: {
    position: 'relative',
    paddingRight: 40,
  },
});

export const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: 7px;
  transform: translateY(-50%);
  color: ${palette.coolGrey2};
`;

export const EmptyListText = styled.p`
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  transform: translate(-50%, -50%);
  margin-bottom: 0;
  color: ${palette.coolGrey2};
`;
