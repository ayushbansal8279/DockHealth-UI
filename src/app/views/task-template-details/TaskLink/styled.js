import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import palette from 'styles/palette';
import { fontWeights } from 'styles/font';

export const LabelsWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
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

export const DelayPeriodLabel = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  margin-right: -10px;
  padding-right: 26px;
  padding-left: 16px;
  border-radius: 15px;
  background-color: ${palette.brightBlue};
  color: ${palette.white};
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
  color: ${palette.white};
`;

export const DelayPeriodForm = styled.form`
  width: 320px;
`;

export const CheckboxLabel = styled.label`
  font-family: 'Roboto', sans-serif;
  color: ${palette.mediumGrey};
`;

export const Title = styled.p`
  margin-bottom: 0;
  font-weight: ${fontWeights.bold};
  font-family: 'Roboto', sans-serif;
  color: ${palette.mediumGrey};
`;
