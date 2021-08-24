import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import palette from 'styles/palette';

export const LabelsWrapper = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  width: fit-content;
  margin: 0 auto;
`;

export const HardDependencyLabel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${palette.brightBlue};
`;

export const MenuWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(110%, -50%);
`;

export const useMenuStyles = makeStyles({
  root: {
    width: 200,
  },
});

export const MenuItemIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 16px;
  width: 16px;
  margin-right: 8px;
  border-radius: 8px;
  background: ${palette.brightBlue};
`;
