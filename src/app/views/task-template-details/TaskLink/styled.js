import styled from 'styled-components';
import palette from 'styles/palette';

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
