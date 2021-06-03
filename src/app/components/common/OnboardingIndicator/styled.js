import styled from 'styled-components';
import palette from 'styles/palette';

export const IndicatorContainer = styled.div`
  width: 100%;
  height: 9px;
  display: flex;
`;

export const IndicatorBar = styled.div`
  width: ${({ steps }) => `${100 / steps}%`};
  background-color: ${({ step, completedSteps }) =>
    step <= completedSteps ? palette.brightBlue : palette.coolGrey3};
  margin-right: ${({ step, steps }) => (step === steps ? '0px' : '4px')};
  border-radius: 9px;
`;
