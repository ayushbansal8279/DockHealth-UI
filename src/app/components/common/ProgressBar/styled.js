import styled from 'styled-components';
import palette from 'styles/palette';

export const ProgressBarContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const ProgressBarWrapper = styled.div`
  background-color: ${palette.coolGrey3};
  width: ${(props) => props.width};
  height: 8px;
  border-radius: 10px;
`;

export const ProgressBarLine = styled.div`
  background-color: ${palette.brightBlue};
  width: ${(props) => `${props.progress}%`};
  border-radius: 4px;
  height: 100%;
`;

export const ProgressBarLabel = styled.div`
  min-width: 40px;
  text-align: right;
  font-size: 14px;
`;
