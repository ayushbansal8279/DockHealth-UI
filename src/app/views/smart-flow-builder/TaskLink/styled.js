import styled from 'styled-components';
import palette from 'styles/palette';

export const LabelsWrapper = styled.div`
  display: flex;
  gap: 5px;
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
  border-radius: 8px;
  background-color: ${palette.brightBlue};
`;
